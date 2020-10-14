const router = require('express').Router();
const controller = require('./ordersController');
const { auth, order } = require('./../middlewares');

router.param('order', order.foundOrder);

router.route('/')
    .get(auth.protected, auth.restricted('admin', 'chef'), controller.view)
    .post(auth.protected, auth.restricted('customer'), controller.create)

router.route('/:order')
    .get(auth.protected, auth.restricted('admin', 'chef'), controller.show)
    .delete(auth.protected, auth.restricted('admin', 'chef'), controller.delete)

module.exports = router;