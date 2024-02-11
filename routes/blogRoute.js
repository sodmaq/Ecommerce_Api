const express = require('express');
const router = express.Router();
const {
  createBlog,
  updateBlog,
  getABlog,
  deleteBlog,
  getAllBlog,
  likeBlog,
  dislikeBlog,
} = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/updateBlog/:id', authMiddleware, isAdmin, updateBlog);
router.get('/getBlog/:id', getABlog);
router.get('/getAllBlogs', getAllBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.put('/like', authMiddleware, likeBlog);
router.put('/dislike', authMiddleware, dislikeBlog);
module.exports = router;
