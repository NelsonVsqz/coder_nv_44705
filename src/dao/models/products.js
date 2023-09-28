const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: [String],
  code: String,
  stock: Number,
  status: Boolean,
  id: Number,
  category: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },  
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
