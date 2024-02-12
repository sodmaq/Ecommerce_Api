const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
} = require('../controller/blogCatController');

router.post('/addCategory', authMiddleware, isAdmin, createCategory);
router.put('/updateCategory/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/deleteCategory/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/getCategory/:id', getCategory);
router.get('/', getAllCategory);

module.exports = router;
