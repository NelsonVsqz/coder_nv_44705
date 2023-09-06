const express = require("express");
const indexRouter = express.Router();
const indexController = require("../controllers/indexController");
const { passportCall, authorization } = require('../middlewares/auth');

indexRouter.get("/login", (req, res) => {
  res.render("login.handlebars");
});

indexRouter.get("/", (req, res) => {
  res.redirect("/auth/login");
});

indexRouter.get("/home", passportCall('jwt'), indexController.getProductsHome);

indexRouter.get("/realtimeproducts", passportCall('jwt'), authorization('admin'), indexController.getProductRealTime);

module.exports = indexRouter;
