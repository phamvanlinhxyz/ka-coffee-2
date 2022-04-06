const Comment = require('../models/Comment');
const Story = require('../models/Story');
const ObjectId = require('mongoose').Types.ObjectId;

// [POST] /comment
const postComment = async (req, res) => {
    const { commentedAt, content } = req.body;
    try {
        if (!ObjectId.isValid(commentedAt)) {
            return res.redirect('back');
        }
        const story = await Story.findById(commentedAt);
        if (!story) {
            return res.redirect('back');
        }

        const comment = await Comment.create({
            content,
            user: req.user._id,
            commentedAt,
        });
        res.redirect('back');
    } catch (error) {
        console.log(error);
    }
};

module.exports = { postComment };
