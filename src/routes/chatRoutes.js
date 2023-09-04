const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chatController");
const { passportCall, authorization } = require('../middlewares/auth');

chatRouter.get("/", (req, res) => {
  res.render("chat.handlebars", { title: "Chat" });
});

chatRouter.get("/messages", passportCall('jwt'), authorization('usuario'), chatController.getMessages);

module.exports = chatRouter;
