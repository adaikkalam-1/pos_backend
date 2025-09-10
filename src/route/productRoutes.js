const express = require('express');
const router = express.Router();
const { list, getProduct, createProduct, updateProduct, deleteProduct } = require('../controller/productController');

router.get('/', list);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;