const router = require('express').Router();
const Joi = require('joi');
const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation')({ passError: true });
const { codeGuard } = require('../middlewares/code-guard');
const am = require('../../utils/async-middleware');
const { ID_SCHEMA, RANGE_SCHEMA } = require('../../utils');
const { MemberSchema } = require('../models/schemas');
const memberController = require('../controllers/member-controller');

router.get(
  '/',
  guard.check('member:read'),
  validator.query(RANGE_SCHEMA),
  am(memberController.getAllMembers),
);

router.post(
  '/',
  guard.check('member:write'),
  // FIXME: Handle codeGuard
  validator.body(MemberSchema.requiredKeys('firstName', 'lastName')),
  am(codeGuard),
  am(memberController.createMember),
);

router.get(
  '/:id',
  guard.check('member:read'),
  validator.params(ID_SCHEMA),
  am(memberController.getMemberById),
);

router.put(
  '/:id',
  guard.check('member:write'),
  validator.params(ID_SCHEMA),
  // FIXME: Handle codeGuard
  validator.body(MemberSchema.min(1)),
  am(codeGuard),
  am(memberController.updateMember),
);
router.post(
  '/:id/delete',
  guard.check('member:write'),
  validator.params(ID_SCHEMA),
  am(codeGuard),
  am(memberController.deleteMember),
);

router.post(
  '/:id/register',
  guard.check('member:write'),
  validator.params(ID_SCHEMA),
  am(codeGuard),
  am(memberController.registerMember),
);
router.post(
  '/:id/unregister/:year',
  guard.check('member:write'),
  validator.params(ID_SCHEMA.append({ year: Joi.number().integer().required() })),
  am(codeGuard),
  am(memberController.unregisterMember),
);

module.exports = router;
