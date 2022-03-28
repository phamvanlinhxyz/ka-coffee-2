const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Story = new mongoose.Schema(
    {
        description: { type: String, minLength: 100 },
        title: { type: String, maxLength: 20 },
        image: { type: String, required: true },
        user: {
            ref: 'User',
            type: mongoose.Types.ObjectId,
            required: true,
        },
        slug: { type: 'string', slug: 'title', unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Story', Story);
