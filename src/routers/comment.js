const express = require('express');
const { postComment } = require('../app/controllers/CommentController');
const router = express.Router();

router.post('/', postComment);

module.exports = router;
