const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(
      MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Successful connection to MongoDB");
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
  }
}

module.exports = { connectToDatabase };
