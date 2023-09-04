const express = require("express");
const { Router } = express;
const smsRouter = new Router();
const smsController = require('../controllers/smsController');

smsRouter.get("/", smsController.sendSMS);

module.exports = smsRouter;