const _ = require('underscore');
const Food = require('./food');
const AppError = require('../../utils/appError');
const { asyncWrapper } = require('../../utils/helpers');

exports.view = asyncWrapper(async (req, res, next) => {
    const foods = await Food.find({ isAvailable: { $ne: false } });
    res.status(200).json({
        status: 'success',
        resuslts: foods.length,
        data: { foods }
    });
});

exports.create = asyncWrapper(async (req, res, next) => {
    const { name, description, price, misc, photo } = req.body;
    let food = await Food.findOne({ name });
    if (food) return next(new AppError('food with that name already added...', 400));
    food = await Food.create({ name, description, price, misc, photo });

    res.status(200).json({
        status: 'success',
        data: { food }
    });
})

exports.show = asyncWrapper(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: { food: req.food } 
    })
});

exports.edit = asyncWrapper(async (req, res, next) => {
    const filtered = _.pick(req.body, 'name', 'description', 'price', 'misc', 'photo', 'isAvailable');
    const updatedFood = await Food.findOneAndUpdate({ slug: req.food.slug }, filtered, {
        new: true,
        runValidation: true
    });

    res.status(200).json({
        status: 'success',
        data: { food: updatedFood }
    });
});

exports.delete = asyncWrapper(async (req, res, next) => {
    await Food.findOneAndUpdate({ slug: req.food.slug}, { isAvailable: false });
    res.status(204).json({
        status: 'success',
    });
})