const express = require('express');
const { postComment, replyComment } = require('../app/controllers/CommentController');
const router = express.Router();

router.post('/reply', replyComment);
router.post('/', postComment);

module.exports = router;
