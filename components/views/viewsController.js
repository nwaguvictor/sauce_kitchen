const Food = require('../foods');
const User = require('../users');
const { asyncWrapper } = require('../../utils/helpers');
const AppError = require('../../utils/appError');


const controller = {
    // Home Page
    homePage: asyncWrapper(async (req, res, next) => {
        res.status(200).render('welcome', {
            title: 'Home'
        });
    }),

    // Login
    loginPage: asyncWrapper(async (req, res, next) => {
        if (req.user) res.redirect('/');

        res.status(200).render('auth/login', {
            title: 'login page'
        })
    }),
    login: asyncWrapper(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) return next(new AppError('please provide email and password', 400));

        let user = await User.findOne({ email }).select('+password');
        if (!user) return next(new AppError('email or password is wrong', 401));

        if (user && !(await user.verifyPassword(password, user.password))) {
            return next(new AppError('email or password wrong!', 401))
        }
        
        const token = user.signToken();
        const cookieOptions = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
            httpOnly: true
        }

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.secure = true;
        }
        res.cookie('jwt', token, cookieOptions);
        res.redirect('/')
    }),

    // Register
    registerPage: asyncWrapper(async (req, res, next) => {
        if (req.user) res.redirect('/');
        
        res.status(200).render('auth/register', {
            title: 'register page'
        })
    }),
    register: asyncWrapper(async (req, res, next) => {
        res.redirect('/')
    }),

    // Reset Password
    passwordResetPage: asyncWrapper(async (req, res, next) => {
        res.status(200).render('auth/password-reset', {
            title: 'reset password page'
        })
    }),
    passwordReset: asyncWrapper(async (req, res, next) => {
        res.status(200).render('auth/password-reset', {
            title: 'reset password page'
        })
    }),
    logout: asyncWrapper(async (req, res, next) => {
        res.cookie('jwt', '', { expires: new Date(Date.now() + 5000) });
        res.redirect('/');
    }),

    // Foods Pages
    foodsPage: asyncWrapper(async (req, res, next) => {
        const foods = await Food.find();
        res.status(200).render('foods/index', {
            foods
        })
    }),
    foodPage: asyncWrapper(async (req, res, next) => {
        const food = await Food.findBySlug(req.params.slug);
        res.status(200).render('foods/show', {
            food
        })
    })
}

module.exports = controller;