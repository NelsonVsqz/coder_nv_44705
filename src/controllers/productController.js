const {productsService}  = require('./../repositories/index')
const Product = require("../dao/models/products");
const CustomError = require('../servicesError/customError');
const AuthErrors = require('../servicesError/error-enum');
const {generateProductErrorInfo} = require('../servicesError/messages/errorMessage');

const getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || "";
    const query = req.query.query || "";

    const skip = (page - 1) * limit;
    const filters = {};

    if (query) {
      filters.category = query;
    }

    const sortOptions = {};
    if (sort === "asc") {
      sortOptions.price = 1;
    } else if (sort === "desc") {
      sortOptions.price = -1;
    }

    const totalCount = await productsService.getProductCount(filters);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const prevLink = hasPrevPage
      ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
      : null;
    const nextLink = hasNextPage
      ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
      : null;

    if (sort != "" && query != "") {
      let products = [];

      if (sortOptions.price) {
        products = await Product.aggregate([
          { $match: filters },
          { $sort: sortOptions },
          { $skip: skip },
          { $limit: limit },
        ]);
      } else {
        const options = {
          page: page,
          limit: limit,
          sort: sortOptions,
        };
        const result = await Product.paginate(filters, options);
        products = result.docs;
      }

      const result = {
        status: "success",
        payload: products,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };

      res.json(result);
    } else {

      const products = await productsService.getProducts(
        filters,
        limit,
        skip,
        sortOptions
      );

      res.render("products.handlebars", {
        products,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productsService.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving product" });
  }
};

const renderProductDetail = async (req, res) => {
  try {
    const productId = req.params.pid;
    const detailId = req.body.detail;

    const product = await productsService.getProductById(detailId);

    if (product) {
      res.render("productdetail.handlebars", { product });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving product" });
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { title, description, code, price, stock, category, thumbnail } =
      req.body;

    if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
      
      
      return CustomError.createError({
          name: "Product creation error",
          code: AuthErrors.MISSING_FIELDS,
          message: 'Missing required fields: title, description, code, price, stock, category, thumbnail',
          cause: generateProductErrorInfo({ title, description, code, price, stock, category, thumbnail })
        })
      

      //return res
      //  .status(400)
      //  .json({ error: "All fields are required except thumbnails" });
    }

    if (!Array.isArray(thumbnail)) {
      
      return CustomError.createError({ code: AuthErrors.ERROR_NOTDEFINED, message: 'Thambnail is not array', cause: thumbnail})
      //return res
      //  .status(400)
      //  .json({ error: "Thumbnails should be an array of strings" });
    }

    const product = {
      title,
      description,
      code,
      price,
      stock,
      status: true,
      category,
      thumbnail,
    };

    productsService.addProduct(product);

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.log(`Error adding product: ${error}`);
    return next(error)
    //res.status(500).json({ error: "Error adding product" });
  }
};

const updateProduct = (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;

  try {
    const product = productsService.updateProduct(pid, updatedProduct);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteProduct = (req, res) => {
  const pid = req.params.pid;
  try {
    const product = productsService.deleteProduct(pid);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
    getAllProducts,
    getProductById,
    renderProductDetail,
    addProduct,
    updateProduct,
    deleteProduct,
  };