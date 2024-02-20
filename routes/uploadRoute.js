const express = require('express');
const router = express.Router();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage');
const {
  uploadImages,
  deleteImages,
} = require('../controller/uploadController');

// Route for uploading images
router.post(
  '/',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 10),
  productImgResize,
  uploadImages
);

// Route for deleting an image
router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages);

module.exports = router;
