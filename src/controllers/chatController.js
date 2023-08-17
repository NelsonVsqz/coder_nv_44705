const ProductManager = require("../dao/mongodb/productmanager");
const productManager = new ProductManager();
const MongoDBmessages = require("../dao/mongodb/messagesmanager");
const Message = require("../dao/models/messages");
const mongoDB = new MongoDBmessages();


  const handleNewProduct = (io,productsc) => {
    try{
    const { title, description, code, price, stock, category, thumbnail } =
      productsc;

    if (!title || !description || !code || !price || !stock || !category) {
      return console.log("Error property");
    }

    if (!Array.isArray(thumbnail)) {
      return console.log("Error array");
    }

    const product = {
      title,
      description,
      code,
      price,
      stock,
      status: true,
      category,
      thumbnail,
    };

    productManager.addProduct(product);

    io.emit("new-product", product);

    console.log("New product added:", product);
} catch (error) {
  console.error("Error handling new product:", error);
}

  };


  const handleUserConnection = (io,socket) => {
    console.log(`Cliente conectado y el Socket connected es: ${socket.id}`);
  
    socket.on("new-product", (productsc) => {
      handleNewProduct(io, productsc);
    });
  
    socket.on("disconnect", () => {
      console.log(
        `Cliente desconectado y el Socket disconnected es: ${socket.id}`
      );
    });
  };
  
  const handleChatMessage = (io, socket, data) => {
    const { email, message } = data;
    console.log("Received message:", message);
  
    mongoDB.saveMessage(email, message);
  
    io.emit("chat message", { user: email, message: message });
  };
  
  const handleUserDisconnection = () => {
    console.log("A user disconnected");
  };


const getMessages = async (req, res) => {
    try {
      const messages = await Message.find({});
      res.json(messages);
    } catch (error) {
      console.error("Error retrieving messages from database:", error);
      res.status(500).json({ error: "Error retrieving messages from database" });
    }
  };


  module.exports = {
    handleUserConnection,
    handleChatMessage,
    handleUserDisconnection,
    getMessages
  };

