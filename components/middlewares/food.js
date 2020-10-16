const Food = require('./../foods');
const AppError = require('../../utils/appError');

exports.foundAndSetFood = async (req, res, next, id) => {
    try {
        const food = await Food.findById(id);
        if (!food) return next(new AppError('food with that name not found', 404));

        req.food = food;
        next();
    } catch (err) {
        next(err);
    }
}