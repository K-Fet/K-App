const router = require('express').Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const am = require('../../utils/async-middleware');


// Middlewares

router.use(morgan('combined'));
router.use(bodyParser.json());


// Auth

router.use('/auth', am(require('./auth')));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

// Dispatch to child routes
router.use('/users', am(require('./users')));
router.use('/barmen', am(require('./barmen')));


/*eslint no-unused-vars: "off"*/
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('You don\'t have enough permissions !');
    }
});


// 404 Not found
router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
