const router = require('express').Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../../logger');


// Middlewares

router.use(morgan('combined'));
router.use(bodyParser.json());


// Auth

router.use('/auth', require('./auth'));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

// Dispatch to child routes
router.use('/members', require('./members'));
router.use('/barmen', require('./barmen'));


// Error handling

/*eslint no-unused-vars: "off"*/
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(403).json({
            error: err.name,
            message: 'You don\'t have enough permissions !'
        });
    }

    if (err.userError) {
        logger.verbose('User error for request %s. Error name: %s', req.path, err.name);
        return res.status(400).json({
            error: err.name,
            message: err.message
        });
    }

    logger.error('Server error for the request %s', req.path, err);
    return res.status(500).json({
        error: 'ServerError',
        message: 'A problem has occurred, try again later'
    });
});


// 404 Not found
router.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;
