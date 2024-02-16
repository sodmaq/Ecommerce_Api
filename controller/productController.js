const Product = require('../model/productModel');
const User = require('../model/userModel');
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

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(_id);

    // Check if the product ID already exists in the wishlist
    if (user.wishList.includes(prodId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already exists in the wishlist.',
      });
    }

    // If the product is not in the wishlist, add it
    user.wishList.push(prodId);

    // Save the user with the updated wishlist
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully.',
      user,
    });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
});

const rating = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;

    // Check if the user has already rated the product
    const alreadyRated = await Product.findOne({
      _id: prodId,
      'ratings.user': _id,
    });

    let product;

    if (alreadyRated) {
      // Update the existing rating with the new one
      product = await Product.findOneAndUpdate(
        { _id: prodId, 'ratings.user': _id },
        { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
        { new: true }
      );
    } else {
      // Add the new rating to the product's ratings array
      product = await Product.findByIdAndUpdate(
        prodId,
        { $push: { ratings: { star, comment, user: _id } } },
        { new: true }
      );
    }

    // Calculate average rating
    const totalRatings = product.ratings.length;
    const ratingSum = product.ratings.reduce((sum, item) => sum + item.star, 0);
    const averageRating = totalRatings > 0 ? Math.round(ratingSum / totalRatings) : 0;

    // Update totalrating field in the product document
    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      { totalrating: averageRating },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: alreadyRated
        ? 'Product rating updated successfully'
        : 'Product rated successfully',
      data: finalProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = {
  createProduct,
  getAProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
