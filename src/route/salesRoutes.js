const express = require('express');
const router = express.Router();
const ctrl = require('../controller/salesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, ctrl.listSales);
router.get('/:id', authMiddleware, ctrl.getSaleById);
router.post('/', authMiddleware, ctrl.createSale);

module.exports = router;