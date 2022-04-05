const express = require('express');
const {
    addToCart,
    getCart,
    deleteSingleItem,
    changeBottle,
    checkEmail,
    createCartGuest,
} = require('../app/controllers/CartController');
const { authorizePermission, authenticateUser } = require('../app/middleware/AuthMiddleware');
const router = express.Router();

router.post('/add', addToCart);
router.post('/delete/:id', deleteSingleItem);
router.post('/change-bottle', authorizePermission('admin'), changeBottle);
router.post('/check-email', authorizePermission('admin'), checkEmail);
router.post('/guest', createCartGuest);
router.get('/', authenticateUser, getCart);

module.exports = router;
