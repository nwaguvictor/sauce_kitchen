const router = require('express').Router();
const { auth, view } = require('../middlewares');
const controller = require('./viewsController');

router.use(view.isLoggedIn);
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

// For Admins And Chefs
router.use('/admin', auth.protected, auth.restricted('admin', 'chef'));
router.get('/admin', controller.adminPage);

router.route('/admin/orders')
    .get(controller.ordersPage)

router.route('/admin/users')
    .get(controller.usersPage)

router.route('/admin/kitchen')
    .get(controller.kitchen)

module.exports = router;