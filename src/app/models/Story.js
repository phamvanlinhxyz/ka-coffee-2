const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Story = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
        category: [{ type: String, required: false }],
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
