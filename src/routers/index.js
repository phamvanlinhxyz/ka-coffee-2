const homeRouter = require('./home');
const authRouter = require('./auth');
const meRouter = require('./me');
const adminRouter = require('./admin');
const cartRouter = require('./cart');
const orderRouter = require('./order');
const { attachUser, authenticateUser, authorizePermission } = require('../app/middleware/AuthMiddleware');

const route = (app) => {
    app.use('/auth', authRouter);
    app.use('/me', authenticateUser, meRouter);
    app.use('/admin', authenticateUser, authorizePermission('admin'), adminRouter);
    app.use('/cart', attachUser, cartRouter);
    app.use('/order', attachUser, orderRouter);
    app.use('/', attachUser, homeRouter);
    app.use('*', attachUser, (req, res) => {
        res.render('404', {
            user: req.user ? req.user : 0,
            title: '404'
        });
    });
};

module.exports = route;
