const Product = require('../models/Product');
const Order = require('../models/Order');
const Story = require('../models/Story');

// [GET] /admin/products
const getProductPage = async (req, res) => {
    const page = parseInt(req.query.page ? req.query.page : 1) - 1;
    const perPage = 10;
    try {
        const totalProduct = await Product.count({});
        const products = await Product.find({})
            .sort({ _id: -1 })
            .limit(perPage)
            .skip(perPage * page);

        const pages = Math.ceil(totalProduct / perPage);
        res.status(200).render('admin/product', {
            user: req.user,
            title: 'Quản lý',
            products: products,
            page: page + 1,
            pages: pages,
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/product/create
const addProductPage = (req, res) => {
    res.status(200).render('product/addProduct', {
        user: req.user,
        title: 'Thêm sản phẩm',
    });
};

// [POST] /admin/product/create
const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        product.image = '/uploads/product/' + req.file.filename;
        await product.save();
        res.status(200).redirect('/admin/products');
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/product/:slug/edit
const editProductPage = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({ slug });
        res.status(200).render('product/editProduct', {
            user: req.user,
            title: 'Chỉnh sửa sản phẩm',
            product: product,
        });
    } catch (error) {
        console.log(error);
    }
};

// [PUT] /admin/product/:slug/edit
const editProduct = async (req, res) => {
    try {
        const slug = req.params.slug;
        var updateForm = req.body;
        if (req.file) {
            updateForm['image'] = '/uploads/product/' + req.file.filename;
        }
        const product = await Product.findOneAndUpdate({ slug }, updateForm);
        res.status(200).redirect('/admin/products');
    } catch (error) {
        console.log(error);
    }
};

// [DELETE] /admin/product/:slug/delete
const deleteProduct = async (req, res) => {
    try {
        const slug = req.params.slug;
        await Product.findOneAndDelete({ slug });
        res.status(200).redirect('/admin/products');
    } catch (error) {}
};

// [GET] /admin/orders
const getOrdersPage = async (req, res) => {
    try {
        const orders = await Order.find().sort({ _id: -1 });
        res.status(200).render('admin/orders', {
            user: req.user,
            title: 'Quản lý',
            orders: orders,
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/stories
const getStoriesPage = async (req, res) => {
    const page = parseInt(req.query.page ? req.query.page : 1) - 1;
    const perPage = 10;
    try {
        const totalStory = await Story.count();
        const stories = await Story.find()
            .sort({ _id: -1 })
            .limit(perPage)
            .skip(perPage * page);

        const pages = Math.ceil(totalStory / perPage);
        res.status(200).render('admin/stories', {
            user: req.user,
            title: 'Quản lý',
            stories,
            page: page + 1,
            pages: pages,
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/story/create
const addStoryPage = (req, res) => {
    res.status(200).render('story/addStory', {
        user: req.user,
        title: 'Thêm tin tức',
    });
};

// [POST] /admin/story/create
const addStory = async (req, res) => {
    const story = new Story(req.body);
    story.category = req.body.category.toString().split(', ');
    story.thumbnail = '/uploads/story/' + req.file.filename;
    res.json(story);
    // try {
    //     const product = new Product(req.body);
    //     product.image = '/uploads/product/' + req.file.filename;
    //     await product.save();
    //     res.status(200).redirect('/admin/products');
    // } catch (error) {
    //     console.log(error);
    // }
};

module.exports = {
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
};
