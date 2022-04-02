const express = require('express');
const { createUserOrder, detailOrder, createOrderByAdmin } = require('../app/controllers/OrderController');
const router = express.Router();

router.get('/detail/:id', detailOrder);
router.post('/create', createUserOrder);
router.post('/create/admin', createOrderByAdmin);

module.exports = router;
