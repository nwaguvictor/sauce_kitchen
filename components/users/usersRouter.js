const router = require('express').Router();
const controller = require('./usersController');
const { auth } = require('../middlewares');

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.get('/me', auth.protected, controller.me);

router.route('/').get(auth.protected, auth.restricted('admin'), controller.view);

module.exports = router;


