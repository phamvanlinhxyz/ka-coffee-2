const express = require('express');
const multer = require('multer');
const {
    getProductPage,
    addProductPage,
    addProduct,
    editProductPage,
    editProduct,
    deleteProduct,
    getOrdersPage,
    getStoriesPage,
    addStoryPage,
    addStory,
    editStoryPage,
    editStory,
    deleteStory,
    getUsersPage,
} = require('../app/controllers/AdminController');
const { updateOrder, deleteOrder, getEditOrderPage, editOrder } = require('../app/controllers/OrderController');
const router = express.Router();

var productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/product');
    },
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + '.jpg');
    },
});

var storyStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/story');
    },
    filename: function (req, file, cb) {
        cb(null, 'story-' + Date.now() + '.jpg');
    },
});

const uploadProI = multer({ storage: productStorage });
const uploadStrI = multer({ storage: storyStorage });

// admin/product
router.get('/products', getProductPage);
router.route('/product/create').get(addProductPage).post(uploadProI.single('image'), addProduct);
router.route('/product/:slug/edit').get(editProductPage).put(uploadProI.single('image'), editProduct);
router.delete('/product/:slug/delete', deleteProduct);

// admin/orders
router.get('/orders', getOrdersPage);
router.patch('/orders/:id/update', updateOrder);
router.delete('/orders/:id/delete', deleteOrder);
router.route('/orders/:id/edit').get(getEditOrderPage).post(editOrder);

// admin/stories
router.get('/stories', getStoriesPage);
router.route('/story/create').get(addStoryPage).post(uploadStrI.single('thumbnail'), addStory);
router.route('/story/:slug/edit').get(editStoryPage).put(uploadStrI.single('thumbnail'), editStory);
router.delete('/story/:slug/delete', deleteStory);

// admin/users
router.get('/users', getUsersPage)

module.exports = router;
