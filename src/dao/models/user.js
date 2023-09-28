const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    max: 100,
  },
  last_name: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    max: 100,
  },
  password: {
    type: String,
    required: true,
    max: 100,
  },
  role: {
    type: String,
    default: "usuario",
    enum: ["usuario", "admin", "premium"],
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  }  
});

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
