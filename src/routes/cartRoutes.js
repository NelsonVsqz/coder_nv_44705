const express = require("express");
const { Router } = express;
const cartRouter = new Router();
const cartController = require("../controllers/cartController");
const { passportCall } = require("../middlewares/auth");

cartRouter.post("/", cartController.createCart);

cartRouter.get("/", cartController.getAllCarts);

cartRouter.get("/:cid", cartController.getCartById);

cartRouter.post("/:cid/product/:pid", cartController.addProductToCart);

cartRouter.post("/cart", cartController.addProductToCart2);

cartRouter.post("/cartId2", cartController.viewCartId);

cartRouter.post("/cartjwt", passportCall("jwt"), cartController.getCartByJwt);

cartRouter.delete("/:cid/products/:pid", cartController.deleteProductCart);

cartRouter.put("/:cid", cartController.putCart);

cartRouter.put("/:cid/products/:pid", cartController.putProductCart);

cartRouter.delete("/:cid", cartController.deleteCart);

module.exports = cartRouter;
