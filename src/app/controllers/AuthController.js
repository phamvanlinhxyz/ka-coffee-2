const User = require('../models/User');
const createUserToken = require('../../utils/createUserToken');
const { attachTokenToRes } = require('../../utils/jwt');

// [GET] /auth/login
const getLoginPage = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.status(200).render('auth/login', {
        success: true,
        title: 'Đăng nhập',
        user: '',
    });
};

// [GET] /auth/register
const getRegisterPage = (req, res) => {
    if (req.user) {
        return res.render('homepage');
    }
    res.status(200).render('auth/register', {
        success: true,
        title: 'Đăng ký',
        user: '',
    });
};

// [GET] /auth/logout
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).redirect('/');
};

// [POST] /auth/login
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('auth/login', {
                success: false,
                message: 'Email hoặc mật khẩu không trùng khớp!',
                title: 'Đăng nhập',
                user: '',
            });
        }

        const comparePassword = await user.comparePassword(password);
        if (!comparePassword) {
            return res.status(400).render('auth/login', {
                success: false,
                message: 'Email hoặc mật khẩu không trùng khớp!',
                title: 'Đăng nhập',
                user: '',
            });
        }

        const userToken = createUserToken(user);
        attachTokenToRes({ res, user: userToken });
        res.status(200).redirect('/');
    } catch (error) {
        console.log(error);
    }
};

// [POST] /auth/register
const postRegister = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).render('auth/register', {
                success: false,
                message: 'Email đã được sử dụng!',
                title: 'Đăng ký',
                user: '',
            });
        }
        const newUser = new User(req.body);
        newUser.role = 'user';
        newUser.score = 0;
        newUser.rank = 'Thường';
        await newUser.save();
        res.status(200).redirect('/auth/login');
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getLoginPage,
    getRegisterPage,
    postLogin,
    postRegister,
    logout,
};
