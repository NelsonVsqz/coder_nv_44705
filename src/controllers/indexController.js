const {productsService}  = require('./../repositories/index')

const getProductsHome = async (req, res) => {
  const products = await productsService.getProductsHomeReal();
  const user = req.session.user;
  console.log(products);
  res.render("home.handlebars", { products, user });
};

const getProductRealTime = async (req, res) => {
  const products = await productsService.getProductsHomeReal();
  res.render("realTimeProducts.handlebars", { products });
};

module.exports = {
getProductsHome,
getProductRealTime
};