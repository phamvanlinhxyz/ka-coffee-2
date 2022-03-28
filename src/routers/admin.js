const express = require('express');
const multer = require('multer');
const {
    getProductPage,
    addProductPage,
    addProduct,
    editProductPage,
    editProduct,
    deleteProduct,
} = require('../app/controllers/AdminController');
const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/product');
    },
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + '.jpg');
    },
});

const upload = multer({ storage: storage });

router.get('/products', getProductPage);
router
    .route('/product/create')
    .get(addProductPage)
    .post(upload.single('image'), addProduct);
router
    .route('/product/:slug/edit')
    .get(editProductPage)
    .put(upload.single('image'), editProduct);
router.delete('/product/:slug/delete', deleteProduct);

module.exports = router;