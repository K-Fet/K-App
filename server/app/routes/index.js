const router = require('express').Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const xhub = require('express-x-hub');
const logger = require('../../logger');
const { accessToken } = require('../../config/feed');

// Middlewares

router.use(morgan(
  [
    ':remote-addr',
    '[:date[iso]]',
    '":method :url HTTP/:http-version"',
    ':status',
    ':res[content-length]',
    '":referrer"',
    '":user-agent"',
    ':response-time ms',
  ].join(' '),
  { stream: logger.stream },
));

router.use(xhub({
  algorithm: 'sha1',
  secret: accessToken,
}));
router.use(bodyParser.json());


// No Auth

router.use('/feed', require('./feed'));
router.use('/contact', require('./contact'));

// Auth

router.use('/auth', require('./auth'));

// Feed

router.use('/feed', require('./feed'));
router.use('/feedobjects', require('./feed-object'));
router.use('/categories', require('./category'));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

// Dispatch to child routes
router.use('/me', require('./me'));
router.use('/members', require('./members'));
router.use('/barmen', require('./barmen'));
router.use('/kommissions', require('./kommissions'));
router.use('/permissions', require('./permissions'));
router.use('/roles', require('./roles'));
router.use('/services', require('./services'));
router.use('/specialaccounts', require('./special-accounts'));
router.use('/tasks', require('./tasks'));
router.use('/templates', require('./templates'));

// Error handling

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  // Express-jwt-permissions error
  if (err.code === 'permission_denied') {
    return res.status(403).json({
      error: 'PermissionError',
      message: 'You don\'t have enough permissions!',
    });
  }

  // Express-jwt error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: err.name,
      message: 'You have to log in in order to do that',
    });
  }

  if (err.userError) {
    logger.verbose('User error for request %s %s. Error name: %s', req.method, req.path, err.name);
    return res.status(400).json({
      error: err.name,
      message: err.message,
    });
  }

  logger.warn('Server error for request %s %s.', req.method, req.path, err);
  try {
    const stackStr = err.stack.split('\n').slice(0, 5).join('\n');
    logger.verbose('Stack trace:\n%s', stackStr);
  } catch (e) {
    // ignored
  }
  return res.status(500).json({
    error: 'ServerError',
    message: 'A problem has occurred, try again later',
  });
});


// 404 Not found
router.use('*', (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
