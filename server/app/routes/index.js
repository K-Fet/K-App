const router = require('express').Router();
const am = require('../../utils/async-middleware');

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

// Dispatch to child routes
router.use('/members', am(require('./members')));
router.use('/barmen', am(require('./barmen')));
router.use('/services', am(require('./services')));

// 404 Not found
router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
