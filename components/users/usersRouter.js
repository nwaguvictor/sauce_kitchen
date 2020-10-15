const router = require('express').Router();
const controller = require('./usersController');
const { auth } = require('../middlewares');

// for all users
router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.post('/password-forget', controller.passwordForgot);
router.patch('/password-reset/:token', controller.passwordReset);

// for logged in users
router.use('/', auth.protected)
router.get('/me', controller.me);
router.patch('/me/update', controller.updateMe);
router.patch('/me/password', controller.passwordUpdate);
router.delete('/me/delete', controller.deleteMe);

// Protect and restrict the rest of the routes to the admin only
router.use('/', auth.protected, auth.restricted('admin'))

router.route('/').get(controller.view);
router.route('/:id').get(controller.show).delete(controller.delete)

module.exports = router;


