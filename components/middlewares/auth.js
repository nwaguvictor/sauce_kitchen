const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../users');
const { asyncWrapper } = require('../../utils/helpers');
const AppError = require('../../utils/appError');

const auth = {
    protected: asyncWrapper(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) return next(new AppError('sorry, please log in to proceed', 401));
    
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
        const authUser = await (await User.findById(decoded.id).select('+role'));
    
        if (!authUser) return next(new AppError('user with token not found', 401));
    
        // Grant access and Add user to req object
        req.user = authUser;
        next();
    }),
    restricted: (...allowed) => {
        return (req, res, next) => {
            if (!allowed.includes(req.user.role)) {
                return next(new AppError('Access Denied. Sorry, you are not allowed', 403));
            }
            next();
        };
    }
}

module.exports = auth;