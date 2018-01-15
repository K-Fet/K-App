const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const roleController = require('../controllers/role-controller');

router.get('/', am(roleController.getAllRoles));
router.post('/', am(roleController.createRole));
router.get('/:id(\\d+)', am(roleController.getRoleById));
router.put('/:id(\\d+)', am(roleController.updateRole));
router.delete('/:id(\\d+)', am(roleController.deleteRole));

module.exports = router;