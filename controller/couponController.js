const Coupon = require('../model/couponModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon); // 201: Created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatecoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(updatecoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecoupon = await Coupon.findByIdAndDelete(id);
    if (!deletecoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(deletecoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getAcoupon = await Coupon.findById(id);
    if (!getAcoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(getAcoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const redisTut = async (req, res) => {
  try {
    const { key, value } = req.body;
    const response = await client.set(key, value);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  redisTut,
};
