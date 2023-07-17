const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const { engine } = handlebars;
const session = require('express-session');
const passport = require('passport');
const { connectToDatabase } = require("./dao/mongodb/connectmongo");
const MongoStore = require('connect-mongo');
const routesProducts = require("./routes/products");
const routesCarts = require("./routes/carts");
const iniPassport  = require('./config/passport.config');
const sessionsRouter = require('./routes/sessions');
const authRouter  = require('./routes/auth');

/*
const ProductManager = require("./product-manager");
const productManager = new ProductManager("./products.json");
*/
const ProductManager = require("./dao/mongodb/productmanager");
const productManager = new ProductManager();
const routesChat = require("./routes/chat");
const MongoDBmessages = require("./dao/mongodb/messagesmanager");
const Message = require("./dao/models/messages");
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

connectToDatabase();

app.use(express.static(__dirname + "/public"));

app.engine(
  "handlebars",
  engine(
    {
      defaultLayout: "main",
      extname: ".handlebars",
    },
    {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    }
  )
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");



const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  collectionName: 'sessions',
});
app.use(
  session({
    secret: 'mi-secretcoder96', 
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);


iniPassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/", require("./routes/index"));
app.use("/products", routesProducts);
app.use("/carts", routesCarts);
app.use("/chat", routesChat);
app.use('/auth', authRouter);
app.use('/api/sessions', sessionsRouter);

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

const mongoDB = new MongoDBmessages();

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages from database:", error);
    res.status(500).json({ error: "Error retrieving messages from database" });
  }
});


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("chat message", (data) => {
    const { email, message } = data;
    console.log("Received message:", message);

    mongoDB.saveMessage(email, message);

    io.emit("chat message", { user: email, message: message });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});






const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
