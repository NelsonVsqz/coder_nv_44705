const express = require("express");
const indexRouter = express.Router();
const indexController = require("../controllers/indexController");
const { passportCall } = require('../middlewares/auth');

indexRouter.get("/login", (req, res) => {
  res.render("login.handlebars");
});

indexRouter.get("/", (req, res) => {
  res.redirect("/auth/login");
});

indexRouter.get("/home", passportCall('jwt'), indexController.getProductsHome);

indexRouter.get("/realtimeproducts", indexController.getProductRealTime);

module.exports = indexRouter;
