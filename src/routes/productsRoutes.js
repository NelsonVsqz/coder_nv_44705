const express = require("express");
const { Router } = express;
const productRouter = new Router();
const productController = require('../controllers/productController');
const { passportCall, authorization , authorizationLevel2 } = require('../middlewares/auth');


productRouter.get("/", productController.getAllProducts);

productRouter.get("/:pid", productController.getProductById);

productRouter.post("/detail", productController.renderProductDetail);

productRouter.post("/", passportCall('jwt'), authorizationLevel2('admin','premium'), productController.addProduct);

productRouter.put("/:pid", passportCall('jwt'), authorization('admin'), productController.updateProduct);

productRouter.delete("/:pid", passportCall('jwt'), authorizationLevel2('admin','premium'), productController.deleteProduct);

module.exports = productRouter;
