const router = require('express').Router();
const authController = require('../controllers/auth-controller');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
