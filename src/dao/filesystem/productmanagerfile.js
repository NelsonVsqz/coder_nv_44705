const fs = require("fs");

module.exports = class ProductManager {
  constructor(path) {
    this.products = [];
    this.productId = 1;
    this.path = path;
    try {
      const data = fs.readFileSync(path, "utf-8");
      if (data) {
        this.products = JSON.parse(data);
        this.productId = this.products[this.products.length - 1].id + 1;
      }
    } catch (error) {
      console.log(`Error reading file: ${error}`);
    }
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.log("Ya existe un producto con el mismo código.");
      return;
    }

    product.id = this.productId++;

    this.products.push(product);
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log("Producto agregado.");
    } catch (error) {
      console.log(`Error writing file: ${error}`);
    }
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      if (data) {
        this.products = JSON.parse(data);
        return this.products;
      }
    } catch (error) {
      console.log(`Error reading file: ${error}`);
      return [];
    }
  }

  getProductById(id) {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      if (data) {
        this.products = JSON.parse(data);
        const product = this.products.find((p) => p.id === id);
        if (product) {
          return product;
        } else {
          console.log("Not found");
          return null;
        }
      }
    } catch (error) {
      console.log(`Error reading file: ${error}`);
      return null;
    }
  }


  updateProduct(productId, updatedProduct) {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      console.log(data);
      if (data) {
        this.products = JSON.parse(data);
        const productIndex = this.products.findIndex(
          (product) => product.id === parseInt(productId)
        );
        if (productIndex === -1) {
          throw new Error(`Product with ID ${productId} not found`);
        } else {
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedProduct,
            id: parseInt(productId),
          };
          fs.writeFileSync(this.path, JSON.stringify(this.products));
          console.log("Producto actualizado.");
        }
      }
    } catch (error) {
      console.log(`Error reading/writing file: ${error}`);
    }
  }

  deleteProduct(id) {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      if (data) {
        this.products = JSON.parse(data);
        const index = this.products.findIndex((p) => p.id === parseInt(id));
        if (index >= 0) {
          this.products.splice(index, 1);
          fs.writeFileSync(this.path, JSON.stringify(this.products));
          console.log("Producto eliminado.");
        } else {
          console.log("Not found");
        }
      }
    } catch (error) {
      console.log(`Error reading/writing file: ${error}`);
    }
  }
};