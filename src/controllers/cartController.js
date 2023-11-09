const Cart = require("../dao/models/carts");
const {productsService,ticketService}  = require('./../repositories/index')
const {sendEmailpurchase}  = require('./../controllers/emailController')
const {sendSMSpurchase}  = require('./../controllers/smsController')
const CustomError = require('../servicesError/customError');
const AuthErrors = require('../servicesError/error-enum');
const {findProductErrorInfo,findCartErrorInfo} = require('../servicesError/messages/errorMessage');

const createCart = async (req, res) => {
  try {
    const carts = await Cart.find({});
    const cartId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
    const cart = new Cart({
      id: cartId,
      products: [],
    });

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.log(`Error creating cart: ${error}`);
    res.status(500).json({ error: "Error creating cart" });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.json(carts);
  } catch (error) {
    console.log(`Error getting carts: ${error}`);
    res.status(500).json({ error: "Error getting carts" });
  }
};

const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await Cart.findOne({ id: cid }).populate("products.product");

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error getting cart: ${error}`);
    res.status(500).json({ error: "Error getting cart" });
  }
};

const getAdvertOwner = (req, res) => {
  try {
    
    res.render("owner.handlebars");
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ error: "Error" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      const product = await productsService.getProductById(pid);
      if (product) {
        const cartProduct = cart.products.find(
          (p) => p.product.toString() === pid
        );

        if (cartProduct) {
          cartProduct.quantity += quantity;
        } else {
          cart.products.push({ product: pid, quantity });
        }

        await cart.save();

        res.status(201).json(cart.products);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error adding product to cart: ${error}`);
    res.status(500).json({ error: "Error adding product to cart" });
  }
};

const addProductToCart2 = async (req, res) => {
  try {
    const cid = parseInt(req.body.cartId);
    const pid = req.body.productId;
    const quantity = parseInt(req.body.quantityId);

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      const product = await productsService.getProductById(pid);

      if (product) {
        const cartProduct = cart.products.find(
          (p) => p.product.toString() === pid
        );

        if (cartProduct) {
          cartProduct.quantity += quantity;
        } else {
          cart.products.push({ product: pid, quantity });
        }

        await cart.save();

        res.status(201).json(cart.products);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error adding product to cart: ${error}`);
    res.status(500).json({ error: "Error adding product to cart" });
  }
};

const viewCartId = async (req, res) => {
  try {
    const cid = parseInt(req.body.cartId2);

    const cart = await Cart.findOne({ id: cid }).populate("products.product");

    if (cart) {
      const docs = cart.products.map((doc) => doc.toObject({ getters: true }));
      res.render("cart.handlebars", { cartId2: cid, products: docs });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error getting cart: ${error}`);
    res.status(500).json({ error: "Error getting cart" });
  }
};


const getCartByJwt = async (req, res) => {
  console.log(req.user)  
  try {
    const user = req.user; // Usuario autenticado obtenido del token JWT
    const cartId = user.cart; // Obtener el ID del carrito del usuario
    console.log(user.cart)
    const cart = await Cart.findOne({ _id: cartId }).populate("products.product");

    if (cart) {
      const docs = cart.products.map((doc) => doc.toObject({ getters: true }));
      res.render("cart.handlebars", { cartId2: cartId, products: docs });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error getting cart: ${error}`);
    res.status(500).json({ error: "Error getting cart" });
  }
};

const addProductToCartJwt = async (req, res,next) => {
  try {

    const pid = req.body.productId;
    const quantity = parseInt(req.body.quantityId);
    const user = req.user; 
    const cartId = user.cart; 
    console.log("user.cart")
    console.log(user)
    console.log(user.cart)    
    const cart = await Cart.findOne({ _id: cartId }).populate("products.product");    

    if (cart) {
      const product = await productsService.getProductById(pid);
      const ownerProduct = product.owner? product.owner : 0
      const userOwner = user._id.toString() 
      console.log("ownerProduct y user")
      console.log(ownerProduct)
      console.log(userOwner)

      if (product && ownerProduct != userOwner) {

        const cartProduct = cart.products.find(
          (p) => p.product._id.toString() === pid
          //(p) => p.product.toString() === pid
        );

        console.log("cartProduct")
        console.log(cartProduct)

        if (cartProduct) {
          cartProduct.quantity += quantity;
        } else {
          cart.products.push({ product: pid, quantity });
        }

        await cart.save();

        res.redirect("/products")
      
      } else {
      if (!product && ownerProduct != userOwner) {        
       return CustomError.createError({
          name: "Product not found or product is the owner",
          code: AuthErrors.NOTFOUND_PRODUCT,
          message: 'Product not found database or product is the owner',
          cause: findProductErrorInfo({ cart, pid })
        })
      } else 
      if (ownerProduct == userOwner) {
        res.redirect("/carts/owner/")
        //res.status(404).json({ error: "Product not found" });
      }
      }
    } else {
      
      return CustomError.createError({
        name: "Cart error",
        code: AuthErrors.NOTFOUND_CART,
        message: 'Cart not found database',
        cause: findCartErrorInfo({ cartId })
      })
      
      //res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error adding product to cart catch: ${error}`);
    
    return next(error)
    
    //res.status(500).json({ error: "Error adding product to cart" });
  }
};

const deleteProductCartForm = async (req, res) => {
  try {
    const pid = req.params.pid
    const user = req.user; 
    const cartId = user.cart; 

    const cart = await Cart.findOne({ _id: cartId }).populate("products.product");        

    if (cart) {
      const cartProductIndex = cart.products.find(
        (p) => p._id.toString() === pid
      );
      console.log("cartProductIndex")
      console.log(cartProductIndex)    
      if (cartProductIndex) {
        cart.products.splice(cartProductIndex, 1);
        await cart.save();
        res.render(`cart.handlebars`)
          //.status(200)
          //.json({ message: `Product ${pid} deleted from cart ${cartId}` });
      } else {
        res.status(404).json({ error: "Product not found in cart" });
      }
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error deleting product from cart: ${error}`);
    res.status(500).json({ error: "Error deleting product from cart" });
  }
};

const deleteProductCartApi = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = req.params.pid; //Objetcid producto

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      const cartProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (cartProductIndex !== -1) {
        cart.products.splice(cartProductIndex, 1);
        await cart.save();
        res//.redirect(`/carts/cartjwt`)
          .status(200)
          .json({ message: `Product ${pid} deleted from cart ${cid}` });

      } else {
        res.status(404).json({ error: "Product not found in cart" });
      }
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error deleting product from cart: ${error}`);
    res.status(500).json({ error: "Error deleting product from cart" });
  }
};

const purchaseCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findOne({ _id: cid }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

   const productsToBuy = [];
   const productsNotAvailable = [];
   const productsToBuy2 = [];
   const productsNotAvailable2 = [];    

    for (const cartProduct of cart.products) {
      const product = await productsService.getProductById(cartProduct.product._id);

      if (product && product.stock >= cartProduct.quantity) {
        productsToBuy.push({ product, quantity: cartProduct.quantity });
        productsToBuy2.push({ product: product.title, quantity: cartProduct.quantity });
        product.stock -= cartProduct.quantity;
        await productsService.updateProduct(product._id,product);
      } else {
        productsNotAvailable.push(cartProduct.product._id);
        productsNotAvailable2.push({ product: product.title});
      }
    }

    const totalAmount = productsToBuy.reduce((total, p) => total + p.product.price * p.quantity, 0);
    const purchaser = req.user.email;

    const newTicket = await ticketService.createTicket(totalAmount,purchaser,productsToBuy)

    const productsBoughtIds = productsToBuy.map(p => p.product._id.toString());
    cart.products = cart.products.filter(cartProduct => !productsBoughtIds.includes(cartProduct.product._id.toString()));

    await cart.save();

    const response = {
      ticket: newTicket,
      productsNotAvailable: productsNotAvailable,
    };

   sendEmailpurchase(newTicket, productsNotAvailable, purchaser);
try{
   sendSMSpurchase();
}catch (error) {
  console.log(`Error sms: ${error}`);
}

if (productsNotAvailable.length === 0) {

  res.render('purchaseSuccess', { productsToBuy2 , totalAmount });

} else {

  res.render('purchaseFailure', { productsToBuy2, productsNotAvailable2 });
}

//    res.status(200).json(response);
  } catch (error) {
    console.log(`Error finalizing purchase: ${error}`);
    res.status(500).json({ error: "Error finalizing purchase" });
  }
}


const putCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const products = req.body;

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      cart.products = products;
      await cart.save();
      res.status(200).json({ message: `Cart ${cid} updated with products` });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error updating cart: ${error}`);
    res.status(500).json({ error: "Error updating cart" });
  }
};

const putProductCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = req.params.pid; //Objetid producto
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      const cartProduct = cart.products.find(
        (p) => p.product.toString() === pid
      );

      if (cartProduct) {
        cartProduct.quantity = quantity;
        await cart.save();
        res
          .status(200)
          .json({ message: `Product ${pid} quantity updated in cart ${cid}` });
      } else {
        res.status(404).json({ error: "Product not found in cart" });
      }
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error updating product quantity in cart: ${error}`);
    res.status(500).json({ error: "Error updating product quantity in cart" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      cart.products = [];
      await cart.save();
      res
        .status(200)
        .json({ message: `All products deleted from cart ${cid}` });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error deleting all products from cart: ${error}`);
    res.status(500).json({ error: "Error deleting all products from cart" });
  }
};

module.exports = {
    createCart,
    getAllCarts,
    getCartById,
    addProductToCart,
    addProductToCart2,
    getCartByJwt,
    viewCartId,
    deleteProductCartApi,
    deleteProductCartForm, 
    purchaseCart,        
    putCart,
    putProductCart,
    deleteCart,
    addProductToCartJwt,
    getAdvertOwner
  };