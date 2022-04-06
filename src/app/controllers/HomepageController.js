const Product = require('../models/Product');
const Story = require('../models/Story');
const User = require('../models/User');

// [GET] /
const getHomepage = async (req, res) => {
    const newProduct = await Product.find().sort({ _id: -1 }).limit(3);
    const allProduct = [
        ...(await Product.find({ category: 'Cà phê' }).sort({ _id: -1 }).limit(3)),
        ...(await Product.find({ category: 'Trà sữa' }).sort({ _id: -1 }).limit(3)),
        ...(await Product.find({ category: 'Trà trái cây' }).sort({ _id: -1 }).limit(3)),
        ...(await Product.find({ category: 'Đá xay' }).sort({ _id: -1 }).limit(3)),
        ...(await Product.find({ category: 'Matcha' }).sort({ _id: -1 }).limit(3)),
        ...(await Product.find({ category: 'Đồ uống sẵn' }).sort({ _id: -1 }).limit(3)),
    ];
    // res.json(newProduct);
    res.render('homepage', {
        layout: 'layouts/home-layout',
        user: req.user,
        newProduct,
        allProduct,
        notification: {
            status: '',
            message: '',
        },
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
    const page = parseInt(req.query.page ? req.query.page : 1) - 1;
    const perPage = 6;
    try {
        const totalStory = await Story.count();
        const stories = await Story.find()
            .sort({ _id: -1 })
            .limit(perPage)
            .skip(perPage * page)
            .populate({
                path: 'user',
                model: User,
                select: 'name',
            });

        const pages = Math.ceil(totalStory / perPage);
        res.status(200).render('stories', {
            user: req.user,
            title: 'Tin tức',
            stories,
            page: page + 1,
            pages: pages,
        });
    } catch (error) {
        console.log(error);
    }
};

// [GET] /notification
const getNotification = async (req, res) => {
    res.status(200).render('notification', {
        user: req.user,
        title: 'Thông báo',
        notification: req.user.notification.reverse(),
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

// [GET] /stories/:slug
const getSingleStory = async (req, res) => {
    try {
        const story = await Story.findOne({ slug: req.params.slug }).populate({
            path: 'user',
            model: User,
            select: 'name',
        });
        story.view++;
        await story.save();

        const popularStory = await Story.find().sort({ view: -1 }).limit(3).populate({
            path: 'user',
            model: User,
            select: 'name',
        });

        res.status(200).render('story/detailStory', {
            user: req.user,
            title: story.title,
            story,
            popularStory,
        });
        // res.json(popularStory);
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
    getNotification,
    getSingleStory,
};
