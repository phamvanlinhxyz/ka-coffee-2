const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Product = new Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['Cà phê', 'Trà sữa', 'Trà trái cây', 'Đá xay', 'Matcha', 'Đồ uống sẵn'],
        required: true,
    },
    price: { type: Number, required: true },
    realPrice: { type: Number, required: false },
    description: { type: String, required: true },
    image: {},
    material: { type: String, required: true },
    slug: { type: 'string', slug: 'name', unique: true },
});

module.exports = mongoose.model('products', Product);
