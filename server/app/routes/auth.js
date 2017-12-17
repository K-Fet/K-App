const router = require('express').Router();
const authController = require('../controllers/auth-controller');
const am = require('../../utils/async-middleware');

router.post('/login', am(authController.login));
router.get('/logout', am(authController.logout));

module.exports = router;
