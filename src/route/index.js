const express = require('express');
const router = express.Router();

router.use('/products', require('./productRoutes'));
router.use('/sales', require('./salesRoutes'));
router.use('/auth', require('./authRoutes'));

module.exports = router;