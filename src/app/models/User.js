const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema(
    {
        name: { type: String, required: true, maxLength: 100 },
        phone: { type: String, required: true },
        password: { type: String, required: true, minLength: 8 },
        score: {
            type: Number,
            default: 0,
        },
        address: { type: String, required: true },
        rank: { type: String, default: 'Thường' },
        email: { type: String, required: true },
        role: { type: String, required: true },
        discount: [{ type: mongoose.Types.ObjectId, ref: 'Discount', required: false }],
        notification: [{ type: String, required: false, default: '' }],
        avatar: { type: String },
    },
    {
        timestamps: true,
    }
);

user.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

user.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('user', user);
