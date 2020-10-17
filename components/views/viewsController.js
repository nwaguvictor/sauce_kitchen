const Food = require('../foods');
const User = require('../users');
const Order = require('../orders');
const { asyncWrapper } = require('../../utils/helpers');
const AppError = require('../../utils/appError');

const signCookieToken = (res, user) => {
    const token = user.signToken();
    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions); 
}

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
        
        signCookieToken(res, user);
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
        const { name, email, phone, address, password, passwordConfirm } = req.body;
        let user = await User.findOne({ email });
        if (user) return next(new AppError('User with that email already exist!', 400));

        user = await User.create({ name, email, phone, address, password, passwordConfirm });

        signCookieToken(res, user);
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
    }),
    createOrder: asyncWrapper(async (req, res, next) => {
        let { foodName, food, address } = req.body;
        if (!food) return next(new AppError('sorry, what do you want?', 400))
        if (!address) address = req.user.address;
        const order = await Order.create({ customer: req.user._id, item: food, address });
        res.status(201).json({
            status: 'success',
            data: { order }
        });
    }),

    adminPage: asyncWrapper(async (req, res, next) => {
        res.status(200).render('admin/index', {
            title: 'Admin Dashboard',
        });
    }),
    ordersPage: asyncWrapper(async (req, res, next) => {
        const orders = await Order.find().sort('orderDate');
        res.status(200).render('admin/orders', {
            title: 'Orders',
            orders
        });
    }),
    usersPage: asyncWrapper(async (req, res, next) => {
        const users = await User.find().sort('name');
        res.status(200).render('admin/users', {
            title: 'Users',
            users
        });
    }),
    kitchen: asyncWrapper(async (req, res, next) => {
        const foods = await Food.find().sort('name');
        res.status(200).render('admin/kitchen', {
            title: 'Kitchen',
            foods
        });
    }),
    addFood: asyncWrapper(async (req, res, next) => {
        let { name, description, price, misc, photo } = req.body;
        misc = misc.split(',') || misc.split(', ');
        if (req.file) {
            photo = req.file.filename;
        }
        if (!name || !price || !description) {
            return next(new AppError('please provide food name, price and description', 400));
        }
        const food = await Food.findOne({ name });
        if (food) return next(new AppError('food with that name already added...', 400));
        await Food.create({ name, description, price, misc, photo });

        res.redirect('/admin/kitchen');
    }),
    editFood: asyncWrapper(async (req, res, next) => {
        const filtered = _.pick(req.body, 'name', 'description', 'price', 'misc', 'photo', 'isAvailable');
        if (req.file) {
            filtered.photo = req.file.filename;
        }
        const updatedFood = await Food.findByIdAndUpdate(req.food_id, filtered, {
            new: true,
            runValidation: true
        });
    
        res.redirect('/admin/kitchen');
    }),
    deleteFood: asyncWrapper(async (req, res, next) => {
        await Food.findByIdAndUpdate(req.food._id, { isAvailable: false });

        res.redirect('/admin/kitchen');
    })
}

module.exports = controller;