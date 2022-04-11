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
        if (!cart) {
            return res.redirect('/me/orders');
        }
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
        if (!cart) {
            return res.redirect('/admin/orders');
        }
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

// [POST] /order/create/guest
const createOrderByGuest = async (req, res) => {
    try {
        const { confirm, order } = req.body;
        const newProduct = await Product.find().sort({ _id: -1 }).limit(3);
        const allProduct = [
            ...(await Product.find({ category: 'Cà phê' }).sort({ _id: -1 }).limit(3)),
            ...(await Product.find({ category: 'Trà sữa' }).sort({ _id: -1 }).limit(3)),
            ...(await Product.find({ category: 'Trà trái cây' }).sort({ _id: -1 }).limit(3)),
            ...(await Product.find({ category: 'Đá xay' }).sort({ _id: -1 }).limit(3)),
            ...(await Product.find({ category: 'Matcha' }).sort({ _id: -1 }).limit(3)),
            ...(await Product.find({ category: 'Đồ uống sẵn' }).sort({ _id: -1 }).limit(3)),
        ];
        if (confirm == 'false') {
            const orderDB = await Order.findById(order);
            await orderDB.remove();
            return res.render('homepage', {
                layout: 'layouts/home-layout',
                user: req.user,
                newProduct,
                allProduct,
                notification: {
                    status: 'success',
                    message: 'Đã hủy đặt hàng',
                },
            });
        }
        res.render('homepage', {
            layout: 'layouts/home-layout',
            user: req.user,
            newProduct,
            allProduct,
            notification: {
                status: 'success',
                message: 'Đặt hàng thành công',
            },
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
        if (
            order &&
            (req.user.role == 'admin' ||
                req.user.role == 'super admin' ||
                (order.user && req.user._id.toString() == order.user.toString()))
        ) {
            return res.status(200).render('order/detail', {
                user: req.user,
                title: 'Chi tiết đơn hàng',
                order: order,
            });
        }
        res.status(404).render('404', {
            user: req.user,
            title: '404',
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
        for (let i = 0; i < status.length; i++) {
            if (status[i] == order.status && i != status.length - 1) {
                order.status = status[i + 1];
                break;
            }
        }
        await order.save();

        var customer = await User.findById(order.user);
        if (customer) {
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
        }

        res.status(200).redirect('/admin/orders');
    } catch (error) {
        console.log(error);
    }
};

// [DELETE] /admin/orders/:id/delete
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const order = await Order.findById(id);
        console.log(order);
        await order.remove();
        res.status(200).redirect('/admin/orders');
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/orders/:id/edit
const getEditOrderPage = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, status: 'Chờ xác nhận' }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'image name price slug',
            },
        });
        if (!order) {
            return res.status(404).render('404', {
                user: req.user,
                title: 404,
            });
        }
        res.status(200).render('order/edit', {
            user: req.user,
            title: 'Chỉnh sửa đơn hàng',
            order: order,
        });
    } catch (error) {
        console.log(error);
    }
};

// [POST] /admin/orders/:id/edit
const editOrder = async (req, res) => {
    const update = ({ name, phone, address, note } = req.body);
    update.status = 'Chờ shipper';
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        res.status(200).redirect('/admin/orders');
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createUserOrder,
    detailOrder,
    createOrderByAdmin,
    updateOrder,
    createOrderByGuest,
    deleteOrder,
    getEditOrderPage,
    editOrder,
};
