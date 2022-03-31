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

const Order = new mongoose.Schema(
    {
        orderItems: [SingleOrderItem],
        user: { ref: 'User', type: mongoose.Types.ObjectId, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: [
                'Chờ shipper',
                'Shipper đang giao',
                'Giao thành công',
                'Đã hủy',
                'Đã thanh toán',
            ],
            default: 'Chờ shipper',
        },
        subtotal: { type: Number, default: 0 },
        total: { type: Number, required: true },
        form: {
            type: String,
            required: true,
            enum: ['Mua tại quán', 'Đặt online'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', Order);
