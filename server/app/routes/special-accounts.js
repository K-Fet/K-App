const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation')({ passError: true });
const router = require('express').Router();
const am = require('../../utils/async-middleware');
const { codeGuard } = require('../middlewares/code-guard');
const { ID_SCHEMA } = require('../../utils');
const { SpecialAccountSchema } = require('../models/schemas');
const specialAccountController = require('../controllers/special-account-controller');

router.get(
  '/',
  guard.check('specialaccount:read'),
  am(specialAccountController.getAllSpecialAccounts),
);

router.post(
  '/',
  guard.check('specialaccount:write'),
  validator.body(SpecialAccountSchema.requiredKeys('code', 'connection', 'connection.email')),
  am(codeGuard),
  am(specialAccountController.createSpecialAccount),
);

router.get(
  '/:id',
  guard.check('specialaccount:read'),
  validator.params(ID_SCHEMA),
  am(specialAccountController.getSpecialAccountById),
);

router.put(
  '/:id',
  guard.check('specialaccount:write'),
  validator.params(ID_SCHEMA),
  validator.body(SpecialAccountSchema.min(1)),
  am(codeGuard),
  am(specialAccountController.updateSpecialAccount),
);

router.post(
  '/:id/delete',
  guard.check('specialaccount:write'),
  validator.params(ID_SCHEMA),
  am(codeGuard),
  am(specialAccountController.deleteSpecialAccount),
);

module.exports = router;
