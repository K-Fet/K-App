const router = require('express').Router();
const Joi = require('@hapi/joi');
const guard = require('express-jwt-permissions')();
const validator = require('express-joi-validation').createValidator({ passError: true });
const feedObjectController = require('../controllers/feed-object-controller');
const { ID_SCHEMA } = require('../../utils');
const { FeedObjectSchema } = require('../models/schemas');
const am = require('../../utils/async-middleware');
const { authGuard } = require('../middlewares/auth-guard');

router.get(
  '/',
  validator.query(Joi.object({
    offset: Joi.number().integer().min(1).default(0),
    limit: Joi.number().integer().min(1).max(100)
      .default(40),
  })),
  am(feedObjectController.getAll),
);

router.get(
  '/:id',
  validator.params(ID_SCHEMA),
  am(feedObjectController.getFeedObjectById),
);

// AUTHENTICATION NEEDED
router.use(authGuard());

router.post(
  '/',
  guard.check('feedobject:write'),
  validator.body(FeedObjectSchema.requiredKeys('title', 'content', 'date', 'source')),
  am(feedObjectController.createFeedObject),
);

router.put(
  '/:id',
  guard.check('feedobject:write'),
  validator.params(ID_SCHEMA),
  validator.body(FeedObjectSchema.min(1)),
  am(feedObjectController.updateFeedObject),
);

router.post(
  '/:id/delete',
  guard.check('feedobject:write'),
  validator.params(ID_SCHEMA),
  am(feedObjectController.deleteFeedObject),
);

module.exports = router;
