const mongoose = require('mongoose');

const SingleOrderItem = mongoose.Schema({
    product: { ref: 'Product', type: mongoose.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    size: {
        type: String,
        require: true,
        enum: ['S', 'M', 'L'],
    },
});

const Cart = new mongoose.Schema(
    {
        user: { ref: 'User', type: mongoose.Types.ObjectId, required: false },
        orderItems: [SingleOrderItem],
        subtotal: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Cart', Cart);
