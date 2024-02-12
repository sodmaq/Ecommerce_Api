const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
} = require('../controller/brandController');

router.post('/addBrand', authMiddleware, isAdmin, createBrand);
router.put('/updateBrand/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/deleteBrand/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/getBrand/:id', getBrand);
router.get('/', getAllBrand);

module.exports = router;
