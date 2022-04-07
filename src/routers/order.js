const express = require('express');
const {
    createUserOrder,
    detailOrder,
    createOrderByAdmin,
    createOrderByGuest,
} = require('../app/controllers/OrderController');
const { authorizePermission } = require('../app/middleware/AuthMiddleware');
const router = express.Router();

router.get('/detail/:id', detailOrder);
router.post('/create', authorizePermission('user'), createUserOrder);
router.post('/create/admin', authorizePermission('admin', 'super admin'), createOrderByAdmin);
router.post('/create/guest', createOrderByGuest);

module.exports = router;
