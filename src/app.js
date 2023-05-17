const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const handlebars = require("express-handlebars");
const { engine } = handlebars;
const routesProducts = require("./routes/products");
const routesCarts = require("./routes/carts");

const ProductManager = require("./product-manager");
const productManager = new ProductManager("./products.json");

app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use("/", require("./routes/index"));

app.use("/products", routesProducts);
app.use("/carts", routesCarts);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

io.on("connection", async (socket) => {
  console.log(`Cliente conectado y el Socket connected es: ${socket.id}`);

  socket.on("new-product", (productsc) => {
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
  });

  socket.on("disconnect", () => {
    console.log(
      `Cliente desconectado y el Socket disconnected es: ${socket.id}`
    );
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
