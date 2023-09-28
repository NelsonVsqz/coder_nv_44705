const express = require("express");
const { Router } = express;
const cartRouter = new Router();
const cartController = require("../controllers/cartController");
const { passportCall, authorization, authorizationLevel2 } = require("../middlewares/auth");

cartRouter.post("/", cartController.createCart);

cartRouter.get("/", passportCall("jwt"),authorization('admin'), cartController.getAllCarts);

cartRouter.get("/:cid", cartController.getCartById);

cartRouter.post("/:cid/product/:pid", cartController.addProductToCart);

cartRouter.post("/cart", passportCall("jwt"),authorizationLevel2('usuario','premium'),cartController.addProductToCartJwt);

cartRouter.post("/cartId2", passportCall("jwt"),authorization('admin'), cartController.viewCartId);

cartRouter.post("/cartjwt", passportCall("jwt"), cartController.getCartByJwt);

cartRouter.delete("/:cid/products/:pid", passportCall("jwt"),authorization('usuario'), cartController.deleteProductCartApi);

cartRouter.post("/products/:pid", passportCall("jwt"),authorization('usuario'), cartController.deleteProductCartForm);

cartRouter.put("/:cid", cartController.putCart);

cartRouter.put("/:cid/products/:pid", cartController.putProductCart);

cartRouter.delete("/:cid", cartController.deleteCart);

cartRouter.post("/:cid/purchase", passportCall("jwt"),authorization('usuario'), cartController.purchaseCart);

module.exports = cartRouter;
