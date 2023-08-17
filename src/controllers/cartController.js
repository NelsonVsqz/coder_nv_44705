const Cart = require("../dao/models/carts");
const ProductManager = require("../dao/mongodb/productmanager");
const productManager = new ProductManager();

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

const addProductToCart = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({ id: cid });

    if (cart) {
      const product = await productManager.getProductById(pid);
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
      const product = await productManager.getProductById(pid);

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


const deleteProductCart = async (req, res) => {
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
        res
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
    deleteProductCart,
    putCart,
    putProductCart,
    deleteCart
  };