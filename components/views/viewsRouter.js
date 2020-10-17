const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/view');
const controller = require('./viewsController');

router.use(isLoggedIn);
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
    
router.get('/logout', controller.logout);

router.get('/foods', controller.foodsPage);
router.get('/foods/:slug', controller.foodPage);

module.exports = router;