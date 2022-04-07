const Product = require('../models/Product');
const Order = require('../models/Order');
const Story = require('../models/Story');
const User = require('../models/User');
const Tag = require('../models/Tag');
const Comment = require('../models/Comment');

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
    } catch (error) {
        console.log(error);
    }
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
            .skip(perPage * page)
            .populate({
                path: 'user',
                model: User,
                select: 'name',
            });

        const pages = Math.ceil(totalStory / perPage);
        res.status(200).render('admin/stories', {
            user: req.user,
            title: 'Quản lý',
            stories,
            page: page + 1,
            pages: pages,
        });
        // res.json(stories);
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
    story.categories = req.body.categories
        .toString()
        .split(',')
        .map((category) => {
            return category.trim();
        })
        .filter((category) => {
            return category != '';
        });
    story.thumbnail = '/uploads/story/' + req.file.filename;
    story.user = req.user._id;
    story.view = 0;
    story.comment = 0;
    try {
        var tagsDB = await Tag.findOne({});
        if (!tagsDB) {
            tagsDB = await Tag.create({
                tagsDB: story.categories,
            });
        } else {
            story.categories.forEach((e) => {
                if (!tagsDB.tags.includes(e)) {
                    tagsDB.tags = [...tagsDB.tags, e];
                }
            });
            await tagsDB.save();
        }

        await story.save();
        res.status(200).redirect('/admin/stories');
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/story/:slug/edit
const editStoryPage = async (req, res) => {
    try {
        const slug = req.params.slug;
        const story = await Story.findOne({ slug });
        res.status(200).render('story/editStory', {
            user: req.user,
            title: 'Chỉnh sửa tin tức',
            story,
        });
    } catch (error) {
        console.log(error);
    }
};

// [PUT] /admin/story/:slug/edit
const editStory = async (req, res) => {
    try {
        const slug = req.params.slug;
        var updateForm = req.body;
        updateForm.categories = req.body.categories
            .toString()
            .split(',')
            .map((category) => {
                return category.trim();
            })
            .filter((category) => {
                return category != '';
            });

        if (req.file) {
            updateForm['thumbnail'] = '/uploads/story/' + req.file.filename;
        }
        const story = await Story.findOneAndUpdate({ slug }, updateForm, { new: true });

        var tagsDB = await Tag.findOne({});
        if (!tagsDB) {
            tagsDB = await Tag.create({
                tagsDB: updateForm.categories,
            });
        } else {
            updateForm.categories.forEach((e) => {
                if (!tagsDB.tags.includes(e)) {
                    tagsDB.tags = [...tagsDB.tags, e];
                }
            });
            for (let i = 0; i < tagsDB.tags.length; i++) {
                const e = tagsDB.tags[i];
                const s = await Story.count({ categories: e });
                if (!s) {
                    tagsDB.tags = tagsDB.tags.filter((tag) => {
                        return tag != e;
                    });
                }
            }
            await tagsDB.save();
        }

        res.status(200).redirect('/admin/stories');
    } catch (error) {
        console.log(error);
    }
};

// [DELETE] /story/:slug/delete
const deleteStory = async (req, res) => {
    try {
        const slug = req.params.slug;
        const story = await Story.findOneAndDelete({ slug });
        await Comment.deleteMany({ commentedAt: story._id });

        var tags = await Tag.findOne();
        for (let i = 0; i < story.categories.length; i++) {
            const e = story.categories[i];
            const s = await Story.count({ categories: e });
            if (!s) {
                tags.tags = tags.tags.filter((tag) => {
                    return tag != e;
                });
            }
        }
        await tags.save();

        res.status(200).redirect('/admin/stories');
    } catch (error) {
        console.log(error);
    }
};

// [GET] /admin/users
const getUsersPage = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ score: -1 });
        res.status(200).render('admin/users', {
            user: req.user,
            users,
            title: 'Quản lý',
        });
        // res.json(users)
    } catch (error) {
        console.log(error);
    }
};

// [POST] /admin/users/update
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        var user = await User.findById(id);
        user.role = user.role == 'user' ? 'admin' : 'user';
        await user.save();
        res.status(200).redirect('/admin/users');
    } catch (error) {
        console.log(error);
    }
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
    editStoryPage,
    editStory,
    deleteStory,
    getUsersPage,
    updateUserRole,
};
