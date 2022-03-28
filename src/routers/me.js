const express = require('express');
const {
    getAccountPage,
    getPasswordPage,
    getListOrderPage,
    getListDiscountPage,
    updateAccount,
    updatePassword,
} = require('../app/controllers/MeController');

const router = express.Router();

router.route('/account').get(getAccountPage).post(updateAccount);
router.route('/password').get(getPasswordPage).post(updatePassword);
router.get('/orders', getListOrderPage);
router.get('/discounts', getListDiscountPage);

module.exports = router;
