const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler');
const routes = require('./start/routes');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
app.disable('X-Powered-By');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Routes

// app.post('/signin', routes.userRoutes);

app.use('/api/v1/users', routes.userRoutes);
app.use('/api/v1/foods', routes.foodRoutes);
app.use('/api/v1/orders', routes.orderRoutes);

// Rendering for websites
app.use('/', routes.viewRoutes);

// Catch all undefined routes
app.all('*', (req, res, next) => {
    return next(new AppError(`sorry what do you mean? Resource for ${req.originalUrl} not found`, 404));
})

// Global Error Route Handler
app.use(globalErrorHandler);

module.exports = app;