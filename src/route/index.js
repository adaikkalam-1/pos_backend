const express = require('express');
const router = express.Router();

router.use('/products', require('./productRoutes'));
router.use('/sales', require('./salesRoutes'));

module.exports = router;