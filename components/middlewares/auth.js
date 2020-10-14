const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../users');
const { asyncWrapper } = require('../../utils/helpers');
const AppError = require('../../utils/appError');

exports.protected = asyncWrapper(async (req, res, next) => {
    let token;
    if (req.headers.authorization) token = req.headers.authorization;
    if (!token) return next(new AppError('access denied. Please provide token', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
    const authUser = await (await User.findById(decoded.id).select('+role'));

    if (!authUser) return next(new AppError('user with token not found', 401));

    // Grant access and Add user to req object
    req.user = authUser;
    next();
});

exports.restricted = (...allowed) => {
    return (req, res, next) => {
        if (!allowed.includes(req.user.role)) {
            return next(new AppError('you are forbiden from executing this action', 403));
        }
        next();
    };
}