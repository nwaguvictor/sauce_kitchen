const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./user');
const AppError = require('../../utils/appError');
const { asyncWrapper, sendAuthResponse } = require('../../utils/helpers');

exports.signup = asyncWrapper(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return next(new AppError('user with that email already exist', 400));
    }

    user = await User.create({ name, email, password, passwordConfirm });

    // send response
    sendAuthResponse(res, user);
});

exports.signin = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('provide email and password', 400));

    let user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.verifyPassword(password, user.password))) {
        return next(new AppError('user email or password is incorrect', 401));
    }

    // Send Response
    sendAuthResponse(res, user);
});

exports.view = asyncWrapper(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

