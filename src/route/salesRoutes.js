const express = require('express');
const router = express.Router();
const ctrl = require('../controller/salesController');

router.get('/', ctrl.listSales);
router.get('/:id', ctrl.getSaleById);
router.post('/', ctrl.createSale);

module.exports = router;