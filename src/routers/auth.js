const express = require('express');
const router = express.Router();

const { getLoginPage, getRegisterPage, postLogin, postRegister, logout } = require('../app/controllers/AuthController');

router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);
router.get('/logout', logout);
router.post('/login', postLogin);
router.post('/register', postRegister);

module.exports = router;
