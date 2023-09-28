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
const MongoStore = require('connect-mongo');
const routesindex = require("./routes/indexRoutes");
const routesProducts = require("./routes/productsRoutes");
const routesCarts = require("./routes/cartRoutes");
const iniPassport  = require('./services/authServices');
const sessionsRouter = require('./routes/sessionsRoutes');
const authRouter  = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const emailRouter = require('./routes/emailRoutes');
const smsRouter = require('./routes/smsRoutes');
const recoveryRouter = require('./routes/recoveryRoutes');
const mockingRoutes = require('./routes/mockingRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser')
const routesChat = require("./routes/chatRoutes");
const errorHandler = require("./servicesError/middlewares/handleError");
const chatController = require("./controllers/chatController");
const { addLogger } = require('./logger/logger');
const config = require('./config/config');

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

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
  mongoUrl: config.mongourl,
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
app.use(addLogger);

app.get('/logger', (req, res) => {
  if(config.environment=="production"){
  req.logger.warn("Prueba de log level warn!");
  
  return res.send("Prueba de logger production")
  } else {
    req.logger.warning("Prueba de log level warning!");
  
    return res.send("Prueba de logger developt")

  }

})


app.use("/", routesindex);
app.use("/products", routesProducts);
app.use("/carts", routesCarts);
app.use("/chat", routesChat);
app.use('/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/admin', adminRouter);
app.use('/api/email', emailRouter);
app.use('/api/sms', smsRouter);
app.use('/api/recovery', recoveryRouter);
app.use('/mockingproducts', mockingRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

io.on("connection", (socket) => {

  chatController.handleUserConnection(io, socket);

  socket.on("chat message", (data) => {
    chatController.handleChatMessage(io, socket, data);
  });

  socket.on("disconnect", chatController.handleUserDisconnection);
});

const PORT = config.port;

server.listen(PORT, () => {
  console.log("Server is running on port "+PORT);
});
