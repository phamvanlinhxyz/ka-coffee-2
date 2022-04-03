const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// [GET] /cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'name price image slug',
            },
        });
        if (req.user.role == 'admin') {
            res.status(200).render('cart/adminCart', {
                cart: cart,
                user: req.user,
                customer: 0,
                title: 'Giỏ hàng',
                notification: {
                    status: null,
                    message: null,
                },
            });
        } else {
            res.status(200).render('cart/userCart', {
                user: req.user,
                title: 'Giỏ hàng',
                cart: cart,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// [POST] /cart/add
const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.json(req.body);
        }
        var cart = await Cart.findOne({ user: req.user });
        const product = await Product.findOne({ slug: req.body.product });
        if (!cart) {
            var cartItems = [
                {
                    product: product._id,
                    amount: req.body.amount,
                    size: req.body.size,
                    price: product.price,
                },
            ];
            cart = new Cart({
                user: req.user._id,
                orderItems: cartItems,
                subtotal: parseInt(req.body.amount) * product.price,
            });
            await cart.save();
        } else {
            var duplicate = false;
            cart.orderItems.forEach((item) => {
                if (
                    item.product.toString() == product._id.toString() &&
                    item.size == req.body.size &&
                    item.price == product.price
                ) {
                    item.amount += parseInt(req.body.amount);
                    duplicate = true;
                }
            });
            if (!duplicate) {
                cart.orderItems = [
                    ...cart.orderItems,
                    { product: product._id, amount: req.body.amount, size: req.body.size, price: product.price },
                ];
            }
            cart.subtotal += parseInt(req.body.amount) * product.price;
            await cart.save();
        }
        res.status(200).redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

// [POST] /cart/delete/:id
const deleteSingleItem = async (req, res) => {
    try {
        var cart = await Cart.findOne({ user: req.user }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'price',
            },
        });
        cart.orderItems.forEach((item, index, object) => {
            if (item._id.toString() == req.params.id.toString()) {
                cart.subtotal -= item.amount * item.product.price;
                object.splice(index, 1);
            }
        });
        if (cart.orderItems.length != 0) {
            await cart.save();
        } else {
            await cart.remove();
        }
        res.status(200).redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

// [POST] /cart/change-bottle
const changeBottle = async (req, res) => {
    try {
        var cart = await Cart.findOne({ user: req.user });
        const product = await Product.findOne({ slug: req.body.product });
        if (!cart) {
            var cartItems = [
                {
                    product: product._id,
                    amount: req.body.amount,
                    size: req.body.size,
                    price: 0,
                },
            ];
            cart = new Cart({
                user: req.user._id,
                orderItems: cartItems,
                subtotal: 0,
            });
            await cart.save();
        } else {
            var duplicate = false;
            cart.orderItems.forEach((item) => {
                if (
                    item.product.toString() == product._id.toString() &&
                    item.size == req.body.size &&
                    item.price == 0
                ) {
                    item.amount += parseInt(req.body.amount);
                    duplicate = true;
                }
            });
            if (!duplicate) {
                cart.orderItems = [
                    ...cart.orderItems,
                    { product: product._id, amount: req.body.amount, size: req.body.size, price: 0 },
                ];
            }
            await cart.save();
        }
        res.status(200).redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

// [POST] /cart/check-email
const checkEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const customer = await User.findOne({ email }).select('_id name phone discount');
        const cart = await Cart.findOne({ user: req.user }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'name price image slug',
            },
        });
        if (!customer) {
            return res.status(400).render('cart/adminCart', {
                user: req.user,
                customer: 0,
                cart: cart,
                title: 'Giỏ hàng',
                notification: {
                    status: 'warning',
                    message: 'Khách hàng không khả dụng',
                },
            });
        }
        res.status(200).render('cart/adminCart', {
            user: req.user,
            customer: customer,
            title: 'Giỏ hàng',
            cart: cart,
            notification: {
                status: 'success',
                message: 'Khách hàng khả dụng',
            },
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /cart/guest
const getCartGuest = async (req, res) => {
    res.status(200).render('cart/guestCart', {
        title: 'Giỏ hàng',
        user: req.user,
    });
};

module.exports = {
    addToCart,
    getCart,
    deleteSingleItem,
    changeBottle,
    checkEmail,
    getCartGuest,
};
