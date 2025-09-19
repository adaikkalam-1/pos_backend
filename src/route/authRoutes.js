const express = require('express');
const router = express.Router();
const ctrl = require('../controller/authController');

router.post('/login', ctrl.login);


module.exports = router;