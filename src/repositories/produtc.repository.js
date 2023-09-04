module.exports = class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getProductCount(filters) {
    try {
      const count = await this.dao.getProductCount(filters);
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
      const result = await this.dao.getProducts(filters, limit, skip, sortOptions);
      return result;
    } catch (error) {
      console.log(`Error getting the products: ${error}`);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const existingProduct = await this.dao.addProduct(product);
      if (!existingProduct) {
        console.log("There is already a product with the same code.");
        return;
      }

      console.log("product added.");
      return
    } catch (error) {
      console.log(`Error adding product: ${error}`);
    }
  }

  async getProductsHomeReal() {
    try {
      const products = await this.dao.getProductsHomeReal(); 
      return products;
    } catch (error) {
      console.log(`Error getting the products: ${error}`);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await this.dao.getProductById(id); 
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
      const product = await this.dao.updateProduct(productId, updatedProduct);
      if (!product) {
        throw new Error(`Product whith ID ${productId} no found`);
      }      
      console.log("Updated Product.");
    } catch (error) {
      console.log(`Error updating product: ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await this.dao.deleteProduct(id);
      if (result) {
        console.log("product removed.");
      } else {
        console.log("product not found");
      }
    } catch (error) {
      console.log(`Error deleting the product: ${error}`);
    }
  }


}
