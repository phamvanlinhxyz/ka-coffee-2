require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();
const db = require('./config/db');
const route = require('./routers');
const port = process.env.PORT;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override
app.use(methodOverride('_method'));

// Static file
app.use(express.static(path.join(__dirname, 'public')));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// Template engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// HTTP logger
app.use(morgan('tiny'));

// Router
route(app);

// Connect db
db.connect();

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
