const router = require('express').Router();
const controller = require('./renderController');

router.get('/', controller.home);
router.get('/foods', controller.foods);

module.exports = router;