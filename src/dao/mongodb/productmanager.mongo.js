const Product = require("../models/products");

module.exports = class ProductManager {
  constructor() {
  }

  async getProductCount(filters) {
    try {
      const count = await Product.countDocuments(filters);
      console.log("count");
      console.log(count);
      return count;
    } catch (error) {
      console.log(`Error counting products: ${error}`);
      return 0;
    }
  }

  async getProducts(filters, limit, skip, sortOptions) {
    try {
      const options = {
        page: Math.ceil(skip / limit) + 1,
        limit: limit,
        sort: sortOptions,
      };


      const result = await Product.paginate(filters, options);

      const docs = result.docs.map((doc) => doc.toObject({ getters: true }));

      return docs;
    } catch (error) {
      console.log(`Error getting the products: ${error}`);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const existingProduct = await Product.findOne({ code: product.code });
      if (existingProduct) {
        console.log("There is already a product with the same code.");
        return false;
      }

      product.id = await this.getNextProductId();

      const newProduct = new Product(product);

      await newProduct.save();

      console.log("product added.");
      return true
    } catch (error) {
      console.log(`Error adding product: ${error}`);
    }
  }

  async getProductsHomeReal() {
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
      const product = await Product.findOne({ _id: productId }).exec();
      if (!product) {
        return false//throw new Error(`Product whith ID ${productId} no found`);
      }

      Object.assign(product, updatedProduct);

      await product.save();

      console.log("Updated Product.");
      console.log(product);
      return true
    } catch (error) {
      console.log(`Error updating product: ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.deleteOne({ _id: id }).exec();
      if (result.deletedCount > 0) {
        console.log("product removed.");
        return true
      } else {
        console.log("product not found");
        return false
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
