const _ = require('underscore');

// Catch async/await functions
exports.asyncWrapper = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

exports.sendAuthResponse = (res, user, message, status) => {
    status = status ? status : 200;
    const jwtToken = user.signToken();

    const cookieOptions = {
        expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), //30days
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    const userProps = _.pick(user, 'name', 'email');

    // Set Cookie
    res.cookie('jwt', jwtToken, cookieOptions);
    res.header('authorization', jwtToken);
    res.status(status).json({
        status: 'success',
        message: message,
        user: userProps
    });
}