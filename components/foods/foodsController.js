const _ = require('underscore');
const Food = require('./food');
const AppError = require('../../utils/appError');
const { asyncWrapper } = require('../../utils/helpers');

const controller = {
    view: asyncWrapper(async (req, res, next) => {
        const foods = await Food.find({ isAvailable: { $ne: false } });
        res.status(200).json({
            status: 'success',
            resuslts: foods.length,
            data: { foods }
        });
    }),
    create: asyncWrapper(async (req, res, next) => {
        const { name, description, price, misc, photo } = req.body;
        let food = await Food.findOne({ name });
        if (food) return next(new AppError('food with that name already added...', 400));
        food = await Food.create({ name, description, price, misc, photo });
    
        res.status(200).json({
            status: 'success',
            data: { food }
        });
    }),
    show: asyncWrapper(async (req, res, next) => {
        res.status(200).json({
            status: 'success',
            data: { food: req.food } 
        })
    }),
    edit: asyncWrapper(async (req, res, next) => {
        const filtered = _.pick(req.body, 'name', 'description', 'price', 'misc', 'photo', 'isAvailable');
        const updatedFood = await Food.findByIdAndUpdate(req.food_id, filtered, {
            new: true,
            runValidation: true
        });
    
        res.status(200).json({
            status: 'success',
            data: { food: updatedFood }
        });
    }),
    delete: asyncWrapper(async (req, res, next) => {
        await Food.findByIdAndUpdate(req.food._id, { isAvailable: false });
        res.status(204).json({
            status: 'success',
        });
    })
}

module.exports = controller;