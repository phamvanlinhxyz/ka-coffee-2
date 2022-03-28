const Cart = require('../models/Cart');
const Product = require('../models/Product');

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
        res.status(200).render('cart/userCart.ejs', {
            user: req.user,
            title: 'Giỏ hàng',
            cart: cart,
        });
        // res.json(cart);
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
                if (item.product.toString() == product._id.toString() && item.size == req.body.size) {
                    item.amount += parseInt(req.body.amount);
                    duplicate = true;
                }
            });
            if (!duplicate) {
                cart.orderItems = [
                    ...cart.orderItems,
                    { product: product._id, amount: req.body.amount, size: req.body.size },
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

module.exports = { addToCart, getCart, deleteSingleItem };
