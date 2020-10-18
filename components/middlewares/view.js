const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../users');
const { asyncWrapper } = require("../../utils/helpers");

exports.isLoggedIn = asyncWrapper(async (req, res, next) => {
    if (req.cookies.jwt) {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_KEY);
        const auth = await User.findById(decoded.id).select('+role');

        if (!auth) return next();

        res.locals.auth = auth;
        req.user = auth;
        return next();
    }
    
    next();
})