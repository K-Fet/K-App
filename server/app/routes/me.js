const router = require('express').Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({ passError: true });
const am = require('../../utils/async-middleware');
const { RANGE_SCHEMA } = require('../../utils');
const { BarmanSchema, SpecialAccountSchema } = require('../models/schemas');
const { isBarman } = require('../middlewares/is-barman');
const meController = require('../controllers/me-controller');

router.get(
  '/',
  am(meController.me),
);

router.put(
  '/',
  am(meController.updateMe),
);

router.get(
  '/services',
  isBarman,
  validator.query(RANGE_SCHEMA),
  am(meController.getBarmanService),
);
router.post(
  '/services',
  isBarman,
  validator.body(Joi.array().items(Joi.number().integer().required())),
  am(meController.addBarmanService),
);
router.post(
  '/services/delete',
  isBarman,
  validator.body(Joi.array().items(Joi.number().integer().required())),
  am(meController.removeBarmanService),
);
router.get(
  '/tasks',
  isBarman,
  am(meController.getBarmanTasks),
);

module.exports = router;
