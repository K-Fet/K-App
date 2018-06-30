const router = require('express').Router();
const am = require('../../utils/async-middleware');
const feedObjectController = require('../controllers/feed-object-controller');

router.get('/', am(feedObjectController.get));
router.get('/pinned', am(feedObjectController.getPinned));

module.exports = router;
