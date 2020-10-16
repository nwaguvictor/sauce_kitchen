const router = require('express').Router();
const controller = require('./viewsController');

router.get('/', controller.homePage);

router.route('/login')
    .get(controller.loginPage)
    .post(controller.login)
router.route('/register')
    .get(controller.registerPage)
    .post(controller.register)

router.route('/password-reset')
    .get(controller.passwordResetPage)
    .post(controller.passwordReset)

router.get('/foods', controller.foodsPage);
router.get('/foods/:slug', controller.foodPage);

module.exports = router;