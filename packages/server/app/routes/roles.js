const router = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const { ID_SCHEMA } = require('../../utils');
const { RoleSchema } = require('../models/schemas');
const roleController = require('../controllers/role-controller');

router.get(
  '/',
  guard.check('role:read'),
  am(roleController.getAllRoles),
);
router.post(
  '/',
  guard.check('role:write'),
  validator.body(RoleSchema.requiredKeys('name', 'description')),
  am(roleController.createRole),
);
router.get(
  '/:id',
  guard.check('role:read'),
  validator.params(ID_SCHEMA),
  am(roleController.getRoleById),
);
router.put(
  '/:id',
  guard.check('role:write'),
  validator.params(ID_SCHEMA),
  validator.body(RoleSchema.min(1)),
  am(roleController.updateRole),
);
router.post(
  '/:id/delete',
  guard.check('role:write'),
  validator.params(ID_SCHEMA),
  am(roleController.deleteRole),
);

module.exports = router;
