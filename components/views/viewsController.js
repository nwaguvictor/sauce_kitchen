const Foods = require('../foods');
const { asyncWrapper } = require('../../utils/helpers');
const controller = {
    // Home Page
    homePage: asyncWrapper(async (req, res, next) => {
        res.status(200).render('welcome', {
            title: 'Home'
        });
    }),

    // Login
    loginPage: asyncWrapper(async (req, res, next) => {
        res.status(200).render('auth/login', {
            title: 'login page'
        })
    }),
    login: asyncWrapper(async (req, res, next) => {
        res.status(200).render('auth/login', {
            title: 'login page'
        })
    }),

    // Register
    registerPage: asyncWrapper(async (req, res, next) => {
        res.status(200).render('auth/register', {
            title: 'register page'
        })
    }),
    register: asyncWrapper(async (req, res, next) => {
        res.status(200).render('auth/register', {
            title: 'register page'
        })
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

    // Foods Pages
    foodsPage: asyncWrapper(async (req, res, next) => {
        const foods = await Foods.find();
        res.status(200).render('foods/index', {
            foods
        })
    }),
    foodPage: asyncWrapper(async (req, res, next) => {
        const food = await Foods.findBySlug(req.params.slug);
        res.status(200).render('foods/show', {
            food
        })
    })
}

module.exports = controller;