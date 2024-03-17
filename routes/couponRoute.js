const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  redisTut,
} = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.post('/', authMiddleware, isAdmin, createCoupon);
router.post('/red', redisTut);
router.get('/', authMiddleware, isAdmin, getAllCoupons);
router.get('/:id', authMiddleware, isAdmin, getCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
