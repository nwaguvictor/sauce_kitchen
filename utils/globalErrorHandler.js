const AppError = require('./appError');

const mongooseValidationError = err => {
    const errors = Object.values(err.errors).map(error => error.message);
    const message = `Invalid input: ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const mongooseCastError = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const devErrorResponse = (err, req, res) => {
    if (req.xhr || req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            name: err.name,
            message: err.message,
            full_error: err
        });
    } else {
        res.status(err.statusCode).render('errors/index', {
            title: err.status,
            info: { message: err.message, name: err.name, statusCode: err.statusCode }
        });
    }
}

const prodErrorResponse = (err, req, res) => {
    if (req.xhr || req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            res.status(err.statusCode).json({
                status: err.status,
                message: 'Something went wrong... Try again'
            });
        }
    } else {
        if (err.isOperational) {
            res.status(err.statusCode).render('errors/index', {
                title: err.status,
                info: {message: err.message, statusCode: err.statusCode} 
            })
        } else {
            res.status(err.statusCode).render('errors/index', {
                title: err.status,
                info: {message: 'Something went wrong... Try again', statusCode: err.statusCode} 
            })
        }
    }

}

module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        // Development Errors
        devErrorResponse(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Production Errors
        let error = { ...err };
        error.message = err.message;

        if (err.name === 'CastError') error = mongooseCastError(err);
        if (err.name === 'ValidationError') error = mongooseValidationError(err);

        prodErrorResponse(error, req, res);
    }
}