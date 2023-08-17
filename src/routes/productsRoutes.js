const express = require("express");
const { Router } = express;
const productRouter = new Router();
const productController = require('../controllers/productController');
const { passportCall, authorization } = require('../middlewares/auth');


productRouter.get("/", productController.getAllProducts);

productRouter.get("/:pid", productController.getProductById);

productRouter.post("/detail", productController.renderProductDetail);

productRouter.post("/", passportCall('jwt'), authorization('admin'), productController.addProduct);

productRouter.put("/:pid", passportCall('jwt'), authorization('admin'), productController.updateProduct);

productRouter.delete("/:pid", passportCall('jwt'), authorization('admin'), productController.deleteProduct);

module.exports = productRouter;
