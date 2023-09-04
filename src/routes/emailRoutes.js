const express = require("express");
const { Router } = express;
const emailRouter = new Router();
const emailController = require('../controllers/emailController');

emailRouter.get("/", emailController.sendEmail);

emailRouter.get("/attachments", emailController.sendEmailWithAttachments);

module.exports = emailRouter;