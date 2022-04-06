const express = require('express');
const multer = require('multer');
const {
    getAccountPage,
    getPasswordPage,
    getListOrderPage,
    getListDiscountPage,
    updateAccount,
    updatePassword,
} = require('../app/controllers/MeController');

const router = express.Router();

var avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/avatar');
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + '.jpg');
    },
});
const uploadAvtI = multer({ storage: avatarStorage });

router.route('/account').get(getAccountPage).post(uploadAvtI.single('avatar'), updateAccount);
router.route('/password').get(getPasswordPage).post(updatePassword);
router.get('/orders', getListOrderPage);
router.get('/discounts', getListDiscountPage);

module.exports = router;
