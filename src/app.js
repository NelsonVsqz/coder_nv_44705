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
const routesindex = require("./routes/indexRoutes");
const routesProducts = require("./routes/productsRoutes");
const routesCarts = require("./routes/cartRoutes");
const iniPassport  = require('./services/authServices');
const sessionsRouter = require('./routes/sessionsRoutes');
const authRouter  = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const cookieParser = require('cookie-parser')
const routesChat = require("./routes/chatRoutes");
const chatController = require("./controllers/chatController");
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

app.use(cookieParser())

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


app.use("/", routesindex);
app.use("/products", routesProducts);
app.use("/carts", routesCarts);
app.use("/chat", routesChat);
app.use('/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/admin', adminRouter);

//io.on("connection", chatController.handleUserConnection(io, socket));

io.on("connection", (socket) => {
//  console.log("A user connected", socket.id);

  chatController.handleUserConnection(io, socket);

  socket.on("chat message", (data) => {
    chatController.handleChatMessage(io, socket, data);
  });

  socket.on("disconnect", chatController.handleUserDisconnection);
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
