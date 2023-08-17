const ProductManager = require("../dao/mongodb/productmanager");
const productManager = new ProductManager();

const getProductsHome = async (req, res) => {
  const products = await productManager.getProductsHomeReal();
  const user = req.session.user;
  console.log(products);
  res.render("home.handlebars", { products, user });
};

const getProductRealTime = async (req, res) => {
  const products = await productManager.getProductsHomeReal();
  res.render("realTimeProducts.handlebars", { products });
};

module.exports = {
getProductsHome,
getProductRealTime
};