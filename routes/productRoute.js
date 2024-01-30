const express = require('express');
const router = express.Router();
const { createProduct,getAProduct,getAllProduct,updateProduct,deleteProduct } = require('../controller/productController');

router.post('/', createProduct);
router.get('/getAProduct/:id', getAProduct);
router.get('/', getAllProduct);
router.put('/updateProduct/:id',updateProduct);
router.delete('/deleteProduct/:id',deleteProduct);

module.exports = router;
