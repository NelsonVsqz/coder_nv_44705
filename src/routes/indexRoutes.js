const express = require("express");
const indexRouter = express.Router();
const indexController = require("../controllers/indexController");
const passport = require('passport')

indexRouter.get("/login", (req, res) => {
  res.render("login.handlebars");
});

indexRouter.get("/", (req, res) => {
  res.redirect("/auth/login");
});

indexRouter.get("/home", passport.authenticate('jwt', {session:false}), indexController.getProductsHome);

indexRouter.get("/realtimeproducts", indexController.getProductRealTime);

module.exports = indexRouter;
