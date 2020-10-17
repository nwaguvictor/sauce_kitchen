const router = require('express').Router();
const { auth, view, food } = require('../middlewares');
const controller = require('./viewsController');
const multer = require('multer');
const upload = multer({ dest: 'public/img/foods' });

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

// User Order Route
router.post('/orders/create', auth.protected, auth.restricted('customer'), controller.createOrder);

// For Admins And Chefs
router.use('/admin', auth.protected);
router.get('/admin', controller.adminPage);

// Admin Orders Route
router.route('/admin/orders')
    .get(controller.ordersPage, auth.restricted('admin', 'chef'));

// Admin Users Route
router.route('/admin/users')
    .get(controller.usersPage, auth.restricted('admin'));

// Admin Kitchen Route
router.route('/admin/kitchen')
    .get(controller.kitchen)
    .post(food.imageUpload, controller.addFood)
    .patch(food.imageUpload, controller.editFood)
    .delete(controller.deleteFood);

module.exports = router;