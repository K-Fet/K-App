const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const userController = require('../controllers/user-controller');

router.get('/', guard.check('user:read'), userController.getAllUsers);

module.exports = router;
