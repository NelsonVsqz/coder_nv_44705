const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chatController");

chatRouter.get("/", (req, res) => {
  res.render("chat.handlebars", { title: "Chat" });
});

chatRouter.get("/messages", chatController.getMessages);

module.exports = chatRouter;
