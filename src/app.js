const express = require("express");
const app = express();
const routesProducts = require("./routes/products");
const routesCarts = require("./routes/carts");

app.use(express.json());

app.use("/products", routesProducts);
app.use("/carts", routesCarts);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
