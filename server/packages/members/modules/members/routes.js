const { Router } = require('express');
const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation')({ passError: true });
const { codeGuard } = require('../../../../shared/middlewares/code-guard');
const {
  am, ID_SCHEMA, YEAR_SCHEMA, SEARCH_SCHEMA,
} = require('../../../../utils');
const { MemberSchema } = require('../../models');
const controller = require('./controller');

function loadRouter() {
  const router = Router();

  router.get(
    '/',
    guard.check('member:read'),
    validator.query(YEAR_SCHEMA),
    am(controller.getAllMembers),
  );

  router.post(
    '/',
    guard.check('member:write'),
    validator.body(MemberSchema.requiredKeys(['firstName', 'lastName', 'school'])),
    am(controller.createMember),
  );

  router.post(
    '/search',
    guard.check('member:read'),
    validator.body(SEARCH_SCHEMA.requiredKeys('query')),
    am(controller.searchMembers),
  );

  router.get(
    '/:id',
    guard.check('member:read'),
    validator.params(ID_SCHEMA),
    am(controller.getMemberById),
  );

  router.put(
    '/:id',
    guard.check('member:write'),
    validator.params(ID_SCHEMA),
    validator.body(MemberSchema.min(1)),
    am(controller.updateMember),
  );

  router.post(
    '/:id/delete',
    guard.check('member:write'),
    validator.params(ID_SCHEMA),
    am(codeGuard),
    am(controller.deleteMember),
  );
}

module.exports = {
  loadRouter,
};
