const mongoose = require("mongoose");
const config = require('../config/config');
const ProductManagerMongo = require('../dao/mongodb/productmanager.mongo');
const ProductManagerFile  = require('../dao/filesystem/productmanager.file');
const TicketManagerMongo = require('../dao/mongodb/ticketmanager.mongo');
const TicketManagerFile  = require('../dao/filesystem/ticketmanager.file');

let ProductManager;
let TicketManager;

switch (config.persistence) {
    case "MONGO":
  try{  
    mongoose.connect(
        config.mongourl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log("Successful connection to MongoDB");
    } catch (error) {
      console.log(`Error connecting to MongoDB: ${error}`);
    }
 
    ProductManager = ProductManagerMongo
    TicketManager = TicketManagerMongo

        break;
    case "FILE":
    
    console.log("Successful connection to FileSystem");
    ProductManager = ProductManagerFile    
    TicketManager = TicketManagerFile      
        break;        
    case "MEMORY":

      
        break;

    default:
        break;
}

exports.ProductManager = ProductManager;
exports.TicketManager = TicketManager;