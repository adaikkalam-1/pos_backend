const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { list, getProduct, createProduct, updateProduct, deleteProduct } = require('../controller/productController');

router.get('/', authMiddleware, list);
router.get('/:id', authMiddleware, getProduct);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;