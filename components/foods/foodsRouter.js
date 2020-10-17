const router = require('express').Router();
const controller = require('./foodsController');
const { auth, food } = require('../middlewares');

router.param('id', food.foundAndSetFood);

router.route('/')
    .get(controller.view)
    .post(auth.protected, auth.restricted('admin', 'chef'), controller.create);

router.route('/:id')
    .get(controller.show)
    .patch(auth.protected, auth.restricted('admin', 'chef'), controller.edit)
    .delete(auth.protected, auth.restricted('admin', 'chef'), controller.delete);

module.exports = router;
