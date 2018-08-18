const guard = require('express-jwt-permissions')();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });
const router = require('express').Router();
const am = require('../../utils/async-middleware');
const { ID_SCHEMA, RANGE_SCHEMA } = require('../../utils');
const { ServiceSchema } = require('../models/schemas');
const serviceController = require('../controllers/service-controller');

router.get(
  '/',
  guard.check('service:read'),
  validator.query(RANGE_SCHEMA),
  am(serviceController.getAllServices),
);
router.post(
  '/',
  guard.check('service:write'),
  validator.body(Joi.array().items(ServiceSchema.requiredKeys('startAt', 'endAt', ' nbMax')).min(1)),
  am(serviceController.createService),
);
router.get(
  '/:id',
  guard.check('service:read'),
  validator.params(ID_SCHEMA),
  am(serviceController.getServiceById),
);
router.put(
  '/:id',
  guard.check('service:write'),
  validator.params(ID_SCHEMA),
  validator.body(ServiceSchema.min(1)),
  am(serviceController.updateService),
);
router.post(
  '/:id/delete',
  guard.check('service:write'),
  validator.params(ID_SCHEMA),
  am(serviceController.deleteService),
);

module.exports = router;
