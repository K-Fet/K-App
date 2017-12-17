const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const userController = require('../controllers/user-controller');

router.get('/', guard.check('user:read'), userController.getAllUsers);

router.post('/', userController.createUser);

router.get('/:id(\\d+)', userController.getUserById);
router.put('/:id(\\d+)', userController.updateUser);
router.delete('/:id(\\d+)', userController.deleteUser);

module.exports = router;
