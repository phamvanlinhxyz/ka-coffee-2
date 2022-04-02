const express = require('express');
const { addToCart, getCart, deleteSingleItem, changeBottle, checkEmail } = require('../app/controllers/CartController');
const { authorizePermission } = require('../app/middleware/AuthMiddleware');
const router = express.Router();

router.post('/add', addToCart);
router.post('/delete/:id', deleteSingleItem);
router.post('/change-bottle', changeBottle);
router.post('/check-email', checkEmail);
router.get('/', getCart);

module.exports = router;
