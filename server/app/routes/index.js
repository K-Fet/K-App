const router = require('express').Router();
const am = require('../../utils/async-middleware');

// Add API specific middleware
router.use(require('../middlewares/database'));
router.use(require('../middlewares/auth-guard'));

// Dispatch to child routes
router.use('/hello', am(require('./hello-world')));
router.use('/barman', am(require('./list-barmen')));

router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
