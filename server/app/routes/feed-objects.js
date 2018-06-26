const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const feedObjectController = require('../controllers/feed-object-controller');
const am = require('../../utils/async-middleware');

router.get('/', am(feedObjectController.getAll));
router.get('/:id(\\d+)', am(feedObjectController.getFeedObjectById));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

router.post('/', guard.check('feedobject:write'), am(feedObjectController.createFeedObject));
router.put('/:id(\\d+)', guard.check('feedobject:write'), am(feedObjectController.updateFeedObject));
router.post('/:id(\\d+)/delete', guard.check('feedobject:write'), am(feedObjectController.deleteFeedObject));

module.exports = router;
