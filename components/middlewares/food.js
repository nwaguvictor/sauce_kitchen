const Food = require('./../foods');
const AppError = require('../../utils/appError');

exports.foundAndSetFood = async (req, res, next, slug) => {
    try {
        const food = await Food.findBySlug(slug);
        if (!food) return next(new AppError('food with that name not found', 404));

        req.food = food;
        next();
    } catch (err) {
        next(err);
    }
}