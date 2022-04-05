const express = require('express');
const router = express.Router();

const {
    getHomepage,
    getMenu,
    getDiscounts,
    getStories,
    getSingleProduct,
    getNotification,
    getSingleStory,
} = require('../app/controllers/HomepageController');
const { authorizePermission } = require('../app/middleware/AuthMiddleware');

router.get('/menu', getMenu);
router.get('/menu/:slug', getSingleProduct);
router.get('/discounts', getDiscounts);
router.get('/stories', getStories);
router.get('/stories/:slug', getSingleStory);
router.get('/notification', authorizePermission('user'), getNotification);
router.get('/', getHomepage);

module.exports = router;
