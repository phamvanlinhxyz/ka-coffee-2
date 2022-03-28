const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// [POST] /order/create
const createUserOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            _id: req.body.cart,
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
            form: 'Đặt online'
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
        res.status(200).render('order/detail', {
            user: req.user,
            title: 'Chi tiết đơn hàng',
            order: order,
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createUserOrder, detailOrder };
