const router = require('express').Router();
const controller = require('./viewsController');

router.get('/', controller.home);
router.get('/login', controller.login);
router.get('/register', controller.register);
router.get('/password-reset', controller.passwordReset);
router.get('/foods', controller.foods);
router.get('/foods/:slug', controller.food);

module.exports = router;