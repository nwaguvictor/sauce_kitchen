const Order = require('./order');
const AppError = require('./../../utils/appError');
const { asyncWrapper } = require('./../../utils/helpers');

const controller = {
    view: asyncWrapper(async (req, res, next) => {
        const orders = await Order.find();
        res.status(200).json({
            status: 'success',
            data: { orders }
        })
    }),
    create: asyncWrapper(async (req, res, next) => {
        const { address, food } = req.body;
        let order = new Order({
            customer: req.user._id,
            item: food,
            address
        });
        order = await order.save();

        res.status(201).json({
            status: 'success',
            data: { order }
        })
    }),
    show: asyncWrapper(async (req, res, next) => {
        res.status(200).json({
            status: 'success',
            data: {
                order: req.order
            }
        });
    }),
    delete: asyncWrapper(async (req, res, next) => {
        await Order.findByIdAndDelete(req.order._id);
        res.status(204).json({
            status: 'success'
        });
    }),

}

module.exports = controller;