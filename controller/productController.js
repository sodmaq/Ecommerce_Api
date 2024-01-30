const Product = require('../model/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const APIFeatures = require('../utils/apiFeatures');


const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({
      status: 'success',
      newProduct: newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.json({
      status: 'success',
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json({
      status: 'success',
      product: findProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const allProduct = await features.query;
    res.json({
      status: 'success',
      allProducts: allProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    return res.json({
      status: 'success',
      msg: 'product successfully deleted',
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getAProduct, getAllProduct, updateProduct,deleteProduct };
