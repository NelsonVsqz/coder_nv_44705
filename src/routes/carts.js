const express = require("express");
const { Router } = express;
const router = new Router();
const fs = require("fs");

router.post("/", (req, res) => {
  try {
    const data = fs.readFileSync("./carts.json", "utf-8");
    const carts = JSON.parse(data);
    const cartId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
    const cart = {
      id: cartId,
      products: [],
    };

    carts.push(cart);
    fs.writeFileSync("./carts.json", JSON.stringify(carts));

    res.status(201).json(cart);
  } catch (error) {
    console.log(`Error creating cart: ${error}`);
    res.status(500).json({ error: "Error creating cart" });
  }
});

router.get("/", (req, res) => {
  try {
    const cid = req.params.cid;

    const data = fs.readFileSync("./carts.json", "utf-8");
    const carts = JSON.parse(data);

    if (carts) {
      res.json(carts);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error getting cart: ${error}`);
    res.status(500).json({ error: "Error getting cart" });
  }
});

router.get("/:cid", (req, res) => {
  try {
    const cid = req.params.cid;

    const data = fs.readFileSync("./carts.json", "utf-8");
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === parseInt(cid));

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.log(`Error getting cart: ${error}`);
    res.status(500).json({ error: "Error getting cart" });
  }
});

router.post("/:cid/product/:pid", (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);

    const data = fs.readFileSync("./carts.json", "utf-8");
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === parseInt(cid));

    if (cart) {
      const productsData = fs.readFileSync("./products.json", "utf-8");
      const products = JSON.parse(productsData);
      const product = products.find((p) => p.id === pid);

      if (product) {
        const cartProduct = cart.products.find((p) => p.product === pid);

        if (cartProduct) {
          cartProduct.quantity += quantity;
        } else {
          cart.products.push({ product: pid, quantity });
        }

        fs.writeFileSync("./carts.json", JSON.stringify(carts));

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
});

module.exports = router;
