const express = require("express");
const router = express.Router();
const ProductManager = require("../product-manager");
const productManager = new ProductManager("./products.json");


router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts",async (req, res) => {
  const products = await productManager.getProducts();  
  res.render("realTimeProducts", { products });
});

module.exports = router;
