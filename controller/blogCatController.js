const blogCategory = require('../model/blogCatModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await blogCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateCategory = await blogCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteCategory = await blogCategory.findByIdAndDelete(id);
    res.json({
      status: 'success',
      msg: 'successfully deleted',
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getACategory = await blogCategory.findById(id);
    res.json({
      status: 'success',
      category: getACategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await blogCategory.find();
    res.json({
      status: 'success',
      category: allCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
};
