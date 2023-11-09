const {productsService}  = require('./../repositories/index')
const User = require("../dao/models/user");

const getProductsHome = async (req, res) => {
  const products = await productsService.getProductsHomeReal();
  const user = req.session.user;
  const userRole = req.user.role;
  console.log(products);
  res.render("home.handlebars", { products, user, isAdmin: userRole === 'admin' });
};

const getProductRealTime = async (req, res) => {
  const products = await productsService.getProductsHomeReal();
  const user0 = req.user
  const user = user0.toObject({ getters: true })
  const userRole = req.user.role;
 let productPromises = await products.map(async function(product){
    let creador = await User.findOne({ _id: product.owner })
    let productowner = creador? creador.email:"" 
    product.owner = productowner
    return product   
  });

   await Promise.all(productPromises);

  res.render("realTimeProducts.handlebars", { products,user, isAdmin: userRole === 'admin'  });
};

module.exports = {
getProductsHome,
getProductRealTime
};