const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Tag = new mongoose.Schema(
    {
        tags: [{ type: String, required: true }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tag', Tag);
