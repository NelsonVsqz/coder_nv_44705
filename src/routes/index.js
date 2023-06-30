const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongodb/productmanager");
const productManager = new ProductManager();
/*
const ProductManager = require("../product-manager");
const productManager = new ProductManager("./products.json");
*/

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;

  if (user.role !== 'admin' && user.role !== 'usuario') {
    return res.status(403).send('Acceso denegado');
  }

  next();
};

router.get('/perfil', requireLogin, (req, res) => {
  const user = req.session.user;
  res.render('perfil.handlebars', { user });
});
/*
router.get('/products', requireLogin, (req, res) => {
  const user = req.session.user;
  res.render('products', { user });
});
*/
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/register', (req, res) => {
  res.render('register.handlebars');
});

router.get('/login', (req, res) => {
  res.render('login.handlebars');
});

router.get('/', (req, res) => {
  res.redirect('/login');
});


router.get("/home", async (req, res) => {
  const products = await productManager.getProductsHomeReal();
  const user = req.session.user;
  console.log(products);
  res.render("home.handlebars", { products , user });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProductsHomeReal();
  res.render("realTimeProducts.handlebars", { products });
});

module.exports = router;
