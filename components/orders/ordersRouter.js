const router = require('express').Router();
const controller = require('./ordersController');
const { auth, food } = require('./../middlewares');

router.param('food', food.foundAndSetFood);

router.route('/')
    .get()
    .post()

router.route('/:food')
    .get()
    .patch()
    .delete()

module.exports = router;