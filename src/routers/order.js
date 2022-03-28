const express = require('express');
const { createUserOrder, detailOrder } = require('../app/controllers/OrderController');
const router = express.Router();

router.get('/detail/:id', detailOrder);
router.post('/create', createUserOrder);

module.exports = router;
