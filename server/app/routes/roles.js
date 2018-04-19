const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const roleController = require('../controllers/role-controller');

router.get('/', guard.check('role:read'), am(roleController.getAllRoles));
router.post('/', guard.check('role:write'), am(roleController.createRole));
router.get('/:id(\\d+)', guard.check('role:read'), am(roleController.getRoleById));
router.put('/:id(\\d+)', guard.check('role:write'), am(roleController.updateRole));
router.post('/:id(\\d+)/delete', guard.check('role:write'), am(roleController.deleteRole));

module.exports = router;
