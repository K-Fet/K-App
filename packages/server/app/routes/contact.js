const Joi = require('@hapi/joi');
const router = require('express').Router();
const validator = require('express-joi-validation').createValidator({ passError: true });
const am = require('../../utils/async-middleware');
const contactController = require('../controllers/contact-controller');

router.post(
  '/',
  validator.body(Joi.object({
    contactFormName: Joi.string().valid('concert', 'event', 'lost', 'website').required(),
    values: Joi.object().required(),
    token: Joi.string().required(),
  })),
  am(contactController.sendForm),
);

module.exports = router;
