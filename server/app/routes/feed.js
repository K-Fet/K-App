const router = require('express').Router();
const am = require('../../utils/async-middleware');
const feedController = require('../controllers/feed-controller');

router.get('/', am(feedController.get));

module.exports = router;
