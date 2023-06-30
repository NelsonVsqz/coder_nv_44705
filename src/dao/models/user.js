const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
      type: String,
      default: 'usuario',
    },
  });
  const User = mongoose.model('User', UserSchema);

  module.exports = User;