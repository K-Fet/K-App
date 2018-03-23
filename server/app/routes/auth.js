const router = require('express').Router();
const authController = require('../controllers/auth-controller');
const am = require('../../utils/async-middleware');

router.post('/login', am(authController.login));

router.post('/reset-password', am(authController.resetPassword));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

router.get('/refresh', am(authController.refresh));
router.get('/logout', am(authController.logout));

module.exports = router;
