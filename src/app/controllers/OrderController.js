const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const updateRank = (user) => {
    if (user.score < 50) {
        user.rank = 'Thường';
    } else if (user.score < 200) {
        user.rank = 'Bạc';
    } else if (user.score < 400) {
        user.rank = 'Vàng';
    } else {
        user.rank = 'Kim cương';
    }
    return user;
};

const evaluateScore = (user, subtotal) => {
    var score = user.score;
    if (subtotal < 50000) {
        user.score += 1;
    } else if (subtotal < 200000) {
        user.score += 5;
    } else if (subtotal < 500000) {
        user.score += 10;
    } else {
        user.score += 15;
    }
    return updateRank(user);
};

// [POST] /order/create
const createUserOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id,
        });
        const order = new Order({
            orderItems: cart.orderItems,
            user: req.user._id,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            subtotal: cart.subtotal,
            total: cart.subtotal + 20000,
            form: 'Đặt online',
        });
        await cart.remove();
        await order.save();
        req.user.cart = 0;
        const orders = await Order.find({ user: req.user._id }).sort({
            updatedAt: -1,
        });
        res.status(200).render('me/orders', {
            user: req.user,
            title: req.user.name,
            message: 'Đặt hàng thành công!',
            orders: orders,
        });
    } catch (error) {
        console.log(error);
    }
};

// [POST] /order/create/admin
const createOrderByAdmin = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'image',
            },
        });
        var order = new Order({
            orderItems: cart.orderItems,
            name: req.body.name,
            phone: req.body.phone,
            subtotal: cart.subtotal,
            total: cart.subtotal,
            form: 'Mua tại quán',
            status: 'Đã thanh toán',
        });
        if (req.body.user) {
            var customer = await User.findById(req.body.user);
            order.user = customer._id;
            customer = evaluateScore(customer, order.subtotal);
            customer.notification = [
                ...customer.notification,
                {
                    message: `Đơn hàng #${order._id.toString().slice(16, 24)} đã được bạn đặt tại quán`,
                    time: new Date(),
                    image: cart.orderItems[0].product.image,
                },
            ];
        }
        await cart.remove();
        await order.save();
        await customer.save();
        req.user.cart = 0;
        res.status(200).redirect('/admin/orders');
    } catch (error) {
        console.log(error);
    }
};

// [GET] /order/detail/:id
const detailOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'image name price slug',
            },
        });
        if (order && (req.user.role == 'admin' || req.user._id.toString() == order.user.toString())) {
            return res.status(200).render('order/detail', {
                user: req.user,
                title: 'Chi tiết đơn hàng',
                order: order,
            });
        }
        res.status(404).render('404', {
            user: req.user,
            title: 404,
        });
    } catch (error) {
        console.log(error);
    }
};

// [PATCH] /admin/orders/:id/update
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const status = ['Chờ shipper', 'Shipper đang giao', 'Giao thành công'];
    try {
        var order = await Order.findById(id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'image',
            },
        });
        var customer = await User.findById(order.user);
        for (let i = 0; i < status.length; i++) {
            if (status[i] == order.status && i != status.length - 1) {
                order.status = status[i + 1];
                break;
            }
        }
        await order.save();
        if (order.status == 'Giao thành công') {
            customer = evaluateScore(customer, order.subtotal);
        }
        customer.notification = [
            ...customer.notification,
            {
                message:
                    order.status == 'Shipper đang giao'
                        ? `Đơn hàng #${order._id.toString().slice(16, 24)} của bạn đang được giao`
                        : `Đơn hàng #${order._id.toString().slice(16, 24)} của bạn đã giao thành công`,
                time: new Date(),
                image: order.orderItems[0].product.image,
            },
        ];
        await customer.save();
        res.status(200).redirect('/admin/orders');
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createUserOrder, detailOrder, createOrderByAdmin, updateOrder };
