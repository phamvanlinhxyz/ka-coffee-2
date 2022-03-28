const express = require('express');
const { addToCart, getCart, deleteSingleItem } = require('../app/controllers/CartController');
const { authorizePermission } = require('../app/middleware/AuthMiddleware');
const router = express.Router();

router.post('/add', addToCart);
router.post('/delete/:id', deleteSingleItem);
router.get('/', authorizePermission('user'), getCart);

module.exports = router;
