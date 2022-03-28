const { isToken } = require('../../utils/jwt');
const User = require('../models/User');
const Cart = require('../models/Cart');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        res.render('404', {
            user: 0,
        });
    }

    try {
        const { userId } = isToken({ token });
        const user = await User.findById(userId).select('-password');
        const cart = await Cart.findOne({ user: userId });
        user.cart = cart ? cart.orderItems.length : 0;
        req.user = user;
        next();
    } catch (error) {
        res.render('404', {
            user: 0,
        });
    }
};

const attachUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
        next();
    } else {
        try {
            const { userId } = isToken({ token });
            const user = await User.findById(userId).select('-password');
            const cart = await Cart.findOne({ user: userId });
            user.cart = cart ? cart.orderItems.length : 0;
            req.user = user;
            next();
        } catch (error) {
            res.render('404', {
                user: 0,
            });
        }
    }
};

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.render('404', {
                user: req.user,
            });
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizePermission,
    attachUser,
};
