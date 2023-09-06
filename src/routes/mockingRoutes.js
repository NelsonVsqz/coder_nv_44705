const express = require('express');
const { Router } = express;
const routerMocking = new Router();
const productController = require('../controllers/mockingController');

routerMocking.get('/', productController.getSimulatedProducts);

module.exports = routerMocking;
