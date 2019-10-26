const router = require('express').Router();
const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({ passError: true });
const am = require('../../utils/async-middleware');
const feedController = require('../controllers/feed-controller');
const feedObjectController = require('../controllers/feed-object-controller');
const { VERIFY_TOKEN } = require('../constants');

router.post(
  '/webhooks',
  am(feedController.feedWebhooks),
);
router.get(
  '/webhooks',
  validator.query(Joi.object({
    'hub.mode': Joi.string().equal('subscribe').required(),
    'hub.challenge': Joi.string().required(),
    'hub.verify_token': Joi.equal(VERIFY_TOKEN),
  }).required()),
  am(feedController.facebookVerify),
);

router.get(
  '/',
  am(feedObjectController.getAll),
);
router.get(
  '/pinned',
  am(feedObjectController.getPinned),
);

module.exports = router;
