const router = require('express').Router();
const am = require('../../utils/async-middleware');

router.use('/auth', am(require('./auth')));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

// Dispatch to child routes
router.use('/users', am(require('./users')));
router.use('/barmen', am(require('./barmen')));

// 404 Not found
router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
