const Joi = require('joi');
const router = require('express').Router();
const validator = require('express-joi-validation')({ passError: true });
const guard = require('express-jwt-permissions')();
const am = require('../../utils/async-middleware');
const barmanController = require('../controllers/barman-controller');
const { ID_SCHEMA, RANGE_SCHEMA } = require('../../utils');
const { BarmanSchema } = require('../models/schemas');

router.get(
  '/',
  guard.check('barman:read'),
  am(barmanController.getAllBarmen),
);

router.post(
  '/',
  guard.check('barman:write'),
  validator.body(BarmanSchema.requiredKeys('firstName', 'lastName', 'connection',
    'connection.email', 'nickname', 'dateOfBirth', 'flow')),
  am(barmanController.createBarman),
);

router.get(
  '/services',
  guard.check('barman:read'),
  validator.query(RANGE_SCHEMA),
  am(barmanController.getServicesBarmen),
);

router.get(
  '/:id',
  guard.check('barman:read'),
  validator.params(ID_SCHEMA),
  am(barmanController.getBarmanById),
);
router.put(
  '/:id',
  guard.check('barman:write'),
  validator.params(ID_SCHEMA),
  validator.body(BarmanSchema.min(1)),
  am(barmanController.updateBarman),
);
router.post(
  '/:id/delete',
  guard.check('barman:write'),
  validator.params(ID_SCHEMA),
  am(barmanController.deleteBarman),
);

router.get(
  '/:id/services',
  guard.check('barman:read', 'service:read'),
  validator.params(ID_SCHEMA),
  validator.query(RANGE_SCHEMA),
  am(barmanController.getServicesBarman),
);
router.post(
  '/:id/services',
  guard.check('barman:read', 'service:read'),
  validator.params(ID_SCHEMA),
  validator.body(Joi.array().items(Joi.number().integer().required()).required()),
  am(barmanController.createServiceBarman),
);
router.post(
  '/:id/services/delete',
  guard.check('barman:read', 'service:read'),
  validator.params(ID_SCHEMA),
  validator.body(Joi.array().items(Joi.number().integer().required()).required()),
  am(barmanController.deleteServiceBarman),
);

module.exports = router;
