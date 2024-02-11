const express = require('express');
const router = express.Router();
const { createCategory } = require('../controller/prodCategoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/addCategory',authMiddleware, isAdmin, createCategory);

module.exports = router;
