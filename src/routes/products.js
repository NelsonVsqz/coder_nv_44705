const express = require("express");

const { Router } = express;

const router = new Router();

const ProductManager = require("../product-manager");
const productManager = new ProductManager("./products.json");


router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnail } =
      req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ error: "All fields are required except thumbnails" });
    }

    if (!Array.isArray(thumbnail)) {
      return res
        .status(400)
        .json({ error: "Thumbnails should be an array of strings" });
    }

    const product = {
      title,
      description,
      code,
      price,
      stock,
      status: true,
      category,
      thumbnail,
    };

    productManager.addProduct(product);

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.log(`Error adding product: ${error}`);
    res.status(500).json({ error: "Error adding product" });
  }
});

router.put("/:pid", (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  console.log(pid);
  try {
    const product = productManager.updateProduct(pid, updatedProduct);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:pid", (req, res) => {
  const pid = req.params.pid;
  try {
    const product = productManager.deleteProduct(pid);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
