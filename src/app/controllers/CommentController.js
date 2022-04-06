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
        var story = await Story.findById(commentedAt);
        if (!story) {
            return res.redirect('back');
        }

        story.comment++;
        await story.save();
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

// [POST] /comment/reply
const replyComment = async (req, res) => {
    const { commentedAt, content } = req.body;
    try {
        if (!ObjectId.isValid(commentedAt)) {
            return res.redirect('back');
        }
        var comment = await Comment.findById(commentedAt);
        if (!comment) {
            return res.redirect('back');
        }

        comment.reply = [
            ...comment.reply,
            {
                content,
                user: req.user,
            },
        ];
        await comment.save();

        var story = await Story.findById(comment.commentedAt);
        story.comment++;
        await story.save();

        res.redirect('back');
    } catch (error) {
        console.log(error);
    }
};

module.exports = { postComment, replyComment };
