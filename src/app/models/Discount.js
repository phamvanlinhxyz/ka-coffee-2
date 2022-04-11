const mongoose = require('mongoose');

const Discount = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, enum: ['shippingFee', 'money', 'rate'] },
        minusPrice: { type: Number, required: false, default: 0 },
        rankUser: { type: String, required: true },
        minOrder: { type: Number, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Discount', Discount);
