const mongoose = require('mongoose');

const Discount = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    minusPrice: { type: Number, required: true, default: 0 },
    category: { type: String, enum: ['shippingFee', 'money', 'rate'] },
    rankUser: { type: String, required: true },
    minOrder: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});

module.exports = mongoose.model('Discount', Discount);
