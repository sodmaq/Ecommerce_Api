const Brand = require('../model/brandModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json({
      status: 'success',
      msg: 'successfully deleted',
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getABrand = await Brand.findById(id);
    res.json({
      status: 'success',
      Brand: getABrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const allBrand = await Brand.find();
    res.json({
      status: 'success',
      Brand: allBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
};
