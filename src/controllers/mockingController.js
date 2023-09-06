const productService = require('../services/mockingServices');

function getSimulatedProducts(req, res) {
  const numberOfProducts = 100;
  const products = productService.generateRandomProducts(numberOfProducts);
  res.json(products);
}

module.exports = {
  getSimulatedProducts,
};
