if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const helmet = require('helmet');
const ExpressError = require('./utils/ExpressError');
const { setCookie, parseCookie } = require('./middleware');

const app = express();

const cookieParser = require('cookie-parser');

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

styleSrcUrls = [
    "https://fonts.googleapis.com"
];

fontSrcUrls = [
    "https://fonts.gstatic.com"
]

imgSrcUrls = [
    "https://cdn.pixabay.com/photo/2017/05/29/18/22/matrix-2354492_960_720.jpg"
]

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'",],
            scriptSrc: ["'self'", ],
            styleSrc: ["'self'", ...styleSrcUrls],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", ...imgSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls]
        },
    })
);

app.get('/', setCookie, parseCookie, (req, res) => {
    res.render('home')
})

app.get('/products', setCookie, parseCookie, (req, res) => {
    res.render('products')
})

app.get('/about', setCookie, parseCookie, (req, res) => {
    res.render('about')
})

app.get('/apply', setCookie, parseCookie, (req, res) => {
    res.render('apply')
})

app.post('/apply', parseCookie, (req, res) => {
    res.send('Form submitted')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;

    if(statusCode === 404){
        res.render('404')
    }else {
        res.status(statusCode).render('error', { statusCode, message })
    }
})

const port = process.env.PORT || 3000;
app.listen(port, 'localhost', () => {});
