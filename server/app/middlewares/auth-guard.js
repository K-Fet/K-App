const router = require('express').Router();
const jwt = require('express-jwt');
const logger = require('../../logger');
const am = require('../../utils/async-middleware');
const authService = require('../services/auth-service');

const { jwtSecret } = require('../../config/jwt');
const { isTokenRevoked } = require('../services/auth-service');

/**
 * Check if the provided JWT is revoked or not.
 *
 * @param req Request
 * @param payload {Object} JWT Payload
 * @param done Callback
 */
function isRevokedCallback(req, payload, done) {
  const tokenId = payload.jit;

  isTokenRevoked(tokenId)
    .then(jit => done(null, !!jit))
    .catch(err => done(err));
}

if (process.env.NODE_ENV === 'test') {
  logger.warn('[TESTING]: Skipping auth middleware');
  router.use((req, res, next) => {
    req.user = {
      userId: 1,
      // eslint-disable-next-line global-require
      permissions: require('../../config/permissions').PERMISSION_LIST,
    };
    next();
  });
} else {
  // Install the middleware
  router.use(jwt({
    secret: jwtSecret,
    isRevoked: isRevokedCallback,
  }));

  // Add perm to req.user
  router.use(am(async (req, res, next) => {
    const user = await authService.me(req.user.jit);
    req.user.permissions = user.permissions;
    next();
  }));
}

module.exports = router;
