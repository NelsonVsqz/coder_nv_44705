const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongodb/productmanager");
const productManager = new ProductManager();
/*
const ProductManager = require("../product-manager");
const productManager = new ProductManager("./products.json");
*/

router.get("/", async (req, res) => {
  const products = await productManager.getProductsHomeReal();
  console.log(products);
  res.render("home.handlebars", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProductsHomeReal();
  res.render("realTimeProducts.handlebars", { products });
});

module.exports = router;
