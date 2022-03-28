const createUserToken = require('../../utils/createUserToken');
const { attachTokenToRes } = require('../../utils/jwt');
const Order = require('../models/Order');
const User = require('../models/User');

// [GET] /me/account
const getAccountPage = (req, res) => {
    res.render('me/account', {
        success: true,
        user: req.user,
        message: '',
        title: req.user.name,
    });
};

// [GET] /me/password
const getPasswordPage = (req, res) => {
    res.render('me/password', {
        success: true,
        user: req.user,
        message: '',
        title: req.user.name,
    });
};

// [GET] /me/orders
const getListOrderPage = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.render('me/orders', {
            user: req.user,
            title: req.user.name,
            message: '',
            orders: orders,
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /me/discounts
const getListDiscountPage = (req, res) => {
    res.render('me/discount', {
        user: req.user,
        title: req.user.name,
    });
};

const updateAccount = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, email, phone, address }, { new: true }).select(
            '-password'
        );
        const userToken = createUserToken(user);
        attachTokenToRes({ res, user: userToken });

        res.status(200).render('me/account', {
            success: true,
            message: 'Cập nhật thông tin thành công!',
            user: user,
            title: req.user.name,
        });
    } catch (error) {
        console.log(error);
    }
};

const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const comparePassword = await user.comparePassword(req.body.oldPassword);
        if (!comparePassword) {
            return res.status(400).render('me/password', {
                success: false,
                message: 'Mật khẩu không chính xác!',
                user: req.user,
                title: req.user.name,
            });
        }

        user.password = req.body.password;
        await user.save();

        res.status(200).render('me/password', {
            success: true,
            message: 'Cập nhật mật khẩu thành công!',
            user: user,
            title: req.user.name,
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAccountPage,
    getPasswordPage,
    getListOrderPage,
    getListDiscountPage,
    updateAccount,
    updatePassword,
};
