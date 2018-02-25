const router = require('express').Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../../logger');


// Middlewares

router.use(morgan('combined', { stream: logger.stream }));

router.use(bodyParser.json());

// Auth

router.use('/auth', require('./auth'));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

router.get('/templates', (req, res) => {
    res.json([
        {
            name: 'Semaine standard',
            createdAt: '',
            updatedAt: '',
            deletedAt: '',
            services: [
                {
                    nbMax: 5,
                    name: '',
                    categoryId: 1,
                    startAt: {
                        day: 5,
                        hour: 12,
                        minute: 0
                    },
                    endAt:{
                        day: 5,
                        hour: 14,
                        minute: 0
                    }
                },
                {
                    nbMax: 5,
                    name: '',
                    categoryId: 1,
                    startAt: {
                        day: 5,
                        hour: 18,
                        minute: 0
                    },
                    endAt:{
                        day: 5,
                        hour: 22,
                        minute: 0
                    }
                },
                {
                    nbMax: 5,
                    name: '',
                    categoryId: 1,
                    startAt: {
                        day: 5,
                        hour: 22,
                        minute: 0
                    },
                    endAt:{
                        day: 6,
                        hour: 1,
                        minute: 0
                    }
                }
            ]
        }
    ]);
});

// Dispatch to child routes
router.use('/members', require('./members'));
router.use('/barmen', require('./barmen'));
router.use('/kommissions', require('./kommissions'));
router.use('/roles', require('./roles'));
router.use('/services', require('./services'));

// Error handling

/*eslint no-unused-vars: "off"*/
router.use((err, req, res, next) => {
    // Express-jwt-permissions error
    if (err.code === 'permission_denied') {
        logger.verbose('Not enough permissions error for %s %s with token %s', req.method, req.path, req.user.jit);
        return res.status(403).json({
            error: 'PermissionError',
            message: 'You don\'t have enough permissions!'
        });
    }

    // Express-jwt error
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: err.name,
            message: 'You have to log in in order to do that'
        });
    }

    if (err.userError) {
        logger.verbose('User error for request %s %s. Error name: %s', req.method, req.path, err.name);
        return res.status(400).json({
            error: err.name,
            message: err.message
        });
    }

    logger.error('Server error for the request %s %s %s', req.method, req.path, err);
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
