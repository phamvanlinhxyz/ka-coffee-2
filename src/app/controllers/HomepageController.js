const Product = require('../models/Product');

// [GET] /
const getHomepage = async (req, res) => {
    res.render('homepage', {
        layout: 'layouts/home-layout',
        user: req.user,
    });
};

// [GET] /menu
const getMenu = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ _id: -1 });
        res.status(200).render('menu', {
            user: req.user,
            products: products,
            title: 'Sản phẩm',
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /discounts
const getDiscounts = async (req, res) => {
    res.render('discounts', {
        user: req.user,
        title: 'Khuyến mãi',
    });
};

// [GET] /stories
const getStories = async (req, res) => {
    res.render('stories', {
        user: req.user,
        title: 'Tin tức',
    });
};

const getSingleProduct = async (req, res) => {
    const slug = req.params.slug;
    const random1 = Math.random();
    const random2 = Math.random();
    try {
        const product = await Product.findOne({ slug });
        if (!product) {
            res.status(404).render('404', {
                user: req.user,
                title: '404',
            });
        }
        const totalProduct = await Product.count({});
        const related1 = await Product.findOne({}).skip(Math.floor(random1 * totalProduct));
        const related2 = await Product.findOne({}).skip(Math.floor(random2 * totalProduct));

        res.status(200).render('product/detailProduct', {
            user: req.user,
            title: product.name,
            product: product,
            related: [related1, related2],
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getHomepage,
    getMenu,
    getDiscounts,
    getStories,
    getSingleProduct,
};