const Order = require('./../orders');
const AppError = require('../../utils/appError');

exports.foundOrder = (async (req, res, next, order) => {
    try {
        let foundOrder = await Order.findById(order);
        if (!foundOrder) return next(new AppError(`order with id ${order} not found`, 404));

        req.order = foundOrder;
        next();
    } catch (err) {
        next(err);
    }
});