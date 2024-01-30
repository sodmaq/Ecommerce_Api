const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/getAProduct/:id', getAProduct);
router.get('/', getAllProduct);
router.put('/updateProduct/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/deleteProduct/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
