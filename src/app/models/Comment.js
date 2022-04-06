const mongoose = require('mongoose');

const ReplyComment = new mongoose.Schema(
    {
        content: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, rel: 'User', required: true },
    },
    {
        timestamps: true,
    }
);

const Comment = new mongoose.Schema(
    {
        content: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, rel: 'User', required: true },
        commentedAt: { type: mongoose.Types.ObjectId, rel: 'Story', required: true },
        reply: [ReplyComment],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Comment', Comment);
