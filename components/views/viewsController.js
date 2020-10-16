const Foods = require('../foods');
const { asyncWrapper } = require('../../utils/helpers');
const controller = {
    home: asyncWrapper(async (req, res, next) => {
        res.status(200).render('welcome', {
            title: 'Home'
        });
    }),
    foods: asyncWrapper(async (req, res, next) => {
        const foods = await Foods.find();
        res.status(200).render('foods/index', {
            foods
        })
    }),
    food: asyncWrapper(async (req, res, next) => {
        const food = await Foods.findBySlug(req.params.slug);
        res.status(200).render('foods/show', {
            food
        })
    })
}

module.exports = controller;