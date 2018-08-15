const Joi = require('joi');
const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation')({ passError: true });
const router = require('express').Router();
const { TemplateSchema } = require('../models/schemas');
const am = require('../../utils/async-middleware');
const templateController = require('../controllers/template-controller');

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
  validator.params(Joi.object({ id: Joi.number().integer().required() })),
  am(templateController.getTemplateById),
);

router.put(
  '/:id(\\d+)',
  guard.check('template:write'),
  validator.params(Joi.object({ id: Joi.number().integer().required() })),
  validator.body(TemplateSchema.requiredKeys('name', 'services')),
  am(templateController.updateTemplate),
);

router.post(
  '/:id/delete',
  guard.check('template:write'),
  validator.params(Joi.object({ id: Joi.number().integer().required() })),
  am(templateController.deleteTemplate),
);

module.exports = router;
