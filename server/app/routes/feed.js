const router = require('express').Router();
const am = require('../../utils/async-middleware');
const feedController = require('../controllers/feed-controller');
const feedObjectController = require('../controllers/feed-object-controller');

router.post('/webhooks', am(feedController.feedWebhooks));
router.get('/webhooks', am(feedController.facebookVerify));

router.get('/', am(feedObjectController.get));
router.get('/pinned', am(feedObjectController.getPinned));

module.exports = router;
