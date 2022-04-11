const createUserToken = require('../../utils/createUserToken');
const { attachTokenToRes } = require('../../utils/jwt');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Discount = require('../models/Discount');
const ObjectId = require('mongoose').Types.ObjectId;

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
const getListDiscountPage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'discount',
                model: Discount,
                select: 'name minusPrice startTime endTime minOrder category',
            })
            .select('-password');

        user.cart = req.user.cart;

        res.render('me/discount', {
            user,
            title: req.user.name,
        });
        // res.json(user)

        const discountList = user.discount.map((e) => {
            return e['_id'].toString();
        });
        user.discount = req.user.discount.filter((e) => {
            return discountList.includes(e.toString());
        });
        await user.save();
    } catch (error) {
        console.log(error);
    }
};

// [POST] /me/account
const updateAccount = async (req, res) => {
    try {
        const updateForm = ({ name, email, phone, address } = req.body);
        if (req.file) {
            updateForm['avatar'] = '/uploads/avatar/' + req.file.filename;
        }
        const user = await User.findByIdAndUpdate(req.user._id, updateForm, { new: true }).select('-password');
        const cart = await Cart.findOne({ user: user._id });
        user.cart = cart ? cart.orderItems.length : 0;
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

// [POST] /me/password
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
            user: req.user,
            title: req.user.name,
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /me/discounts/:id/save
const saveDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        var allDiscount = await Discount.find();
        for (let i = 0; i < allDiscount.length; i++) {
            const e = allDiscount[i];
            if (new Date(e.endTime) - new Date() < 0) {
                await e.remove();
            }
        }

        const discounts = allDiscount.filter((e) => {
            return new Date(e.startTime) - new Date() < 0;
        });

        if (!ObjectId.isValid(id)) {
            return res.redirect('back');
        }
        const discount = await Discount.findById(id);
        if (!discount) {
            return res.redirect('back');
        }

        if (req.user.role != 'user' || (discount.rankUser != 'Tất cả' && discount.rankUser != req.user.rank)) {
            return res.status(400).render('discounts', {
                user: req.user,
                title: 'Khuyến mãi',
                discounts,
                notification: { status: 'warning', message: 'Bạn chưa đủ điều kiện sử dụng!' },
            });
        }

        const user = await User.findById(req.user._id);
        if (user.discount.includes(id)) {
            return res.status(400).render('discounts', {
                user: req.user,
                title: 'Khuyến mãi',
                discounts,
                notification: { status: 'warning', message: 'Bạn đã lưu mã giảm giá này trước đó!' },
            });
        }

        user.discount = [...user.discount, id];
        user.save();

        res.status(200).render('discounts', {
            user: req.user,
            title: 'Khuyến mãi',
            discounts,
            notification: { status: 'success', message: 'Lưu mã giảm giá thành công!' },
        });
        // res.json(user);
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
    saveDiscount,
};
