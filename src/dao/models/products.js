const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: [String],
  code: String,
  stock: Number,
  status: Boolean,
  id: Number,
  category: String
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
