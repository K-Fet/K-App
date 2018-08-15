const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation')({ passError: true });
const router = require('express').Router();
const { TemplateSchema } = require('../models/schemas');
const am = require('../../utils/async-middleware');
const templateController = require('../controllers/template-controller');
const { ID_SCHEMA } = require('../../utils');

router.get(
  '/',
  guard.check('template:read'),
  am(templateController.getAllTemplates),
);

router.post(
  '/',
  guard.check('template:write'),
  validator.body(TemplateSchema.requiredKeys('name', 'services')),
  am(templateController.createTemplate),
);

router.get(
  '/:id',
  guard.check('template:read'),
  validator.params(ID_SCHEMA),
  am(templateController.getTemplateById),
);

router.put(
  '/:id(\\d+)',
  guard.check('template:write'),
  validator.params(ID_SCHEMA),
  validator.body(TemplateSchema.requiredKeys('name', 'services')),
  am(templateController.updateTemplate),
);

router.post(
  '/:id/delete',
  guard.check('template:write'),
  validator.params(ID_SCHEMA),
  am(templateController.deleteTemplate),
);

module.exports = router;
