const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupons);
router.get('/:id', authMiddleware, isAdmin, getCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
