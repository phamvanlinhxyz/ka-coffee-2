const express = require('express');
const router = express.Router();

const {
    getHomepage,
    getMenu,
    getDiscounts,
    getStories,
    getSingleProduct,
} = require('../app/controllers/HomepageController');

router.get('/menu', getMenu);
router.get('/menu/:slug', getSingleProduct);
router.get('/discounts', getDiscounts);
router.get('/stories', getStories);
router.get('/', getHomepage);

module.exports = router;
