const mongoose = require("mongoose");
const Product = require("../models/products");

module.exports = class ProductManager {
  constructor() {
    this.connectToDatabase();
  }

  async connectToDatabase() {
    try {
      await mongoose.connect(
        "mongodb+srv://codernelsonv:passcoderNV61@clustercodermongonv.rel0t5j.mongodb.net/ecommerce",
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

  async addProduct(product) {
    try {
      const existingProduct = await Product.findOne({ code: product.code });
      if (existingProduct) {
        console.log("There is already a product with the same code.");
        return;
      }

      product.id = await this.getNextProductId();

      const newProduct = new Product(product);

      await newProduct.save();

      console.log("product added.");
    } catch (error) {
      console.log(`Error adding product: ${error}`);
    }
  }

  async getProducts() {
    try {
      const products = await Product.find().lean(); //.exec();
      return products;
    } catch (error) {
      console.log(`Error getting the products: ${error}`);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findOne({ _id: id }).lean(); //.exec();
      console.log("product");
      console.log(product);
      if (product) {
        return product;
      } else {
        console.log("Product not find");
        return null;
      }
    } catch (error) {
      console.log(`Error find product: ${error}`);
      return null;
    }
  }

  async updateProduct(productId, updatedProduct) {
    try {
      const product = await Product.findOne({ id: productId }).exec();
      if (!product) {
        throw new Error(`Product whith ID ${productId} no found`);
      }

      Object.assign(product, updatedProduct);

      await product.save();

      console.log("Updated Product.");
    } catch (error) {
      console.log(`Error updating product: ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.deleteOne({ id: id }).exec();
      if (result.deletedCount > 0) {
        console.log("product removed.");
      } else {
        console.log("product not found");
      }
    } catch (error) {
      console.log(`Error deleting the product: ${error}`);
    }
  }

  async getNextProductId() {
    const maxProduct = await Product.findOne().sort({ id: -1 }).exec();
    if (maxProduct) {
      return maxProduct.id + 1;
    } else {
      return 1;
    }
  }
};
