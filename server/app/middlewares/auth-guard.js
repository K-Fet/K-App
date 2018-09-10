const { Router } = require('express');
const jwt = require('express-jwt');
const conf = require('nconf');
const logger = require('../../logger');
const am = require('../../utils/async-middleware');
const authService = require('../services/auth-service');
const { PERMISSION_LIST } = require('../constants');
const { isTokenRevoked } = require('../services/auth-service');

/**
 * Check if the provided JWT is revoked or not.
 *
 * @param req Request
 * @param payload {Object} JWT Payload
 * @param done Callback
 */
async function isRevoked(req, { jit }, done) {
  try {
    const result = await isTokenRevoked(jit);
    done(null, !!result);
  } catch (e) {
    done(e);
  }
}

/**
 * Authentication guard.
 *
 * @returns {Router} An express router.
 */
function authGuard() {
  if (process.env.NODE_ENV === 'test') {
    logger.warn('[TESTING]: Skipping auth middleware');
    return (req, res, next) => {
      req.user = {
        userId: 1,
        permissions: PERMISSION_LIST,
      };
      next();
    };
  }

  const router = Router();

  // Install the middleware
  const secret = conf.get('web:jwtSecret');

  // Security feature in production mode (safe mode)
  if ((!secret || secret.length < 32) && (process.env.NODE_ENV === 'production' && !process.env.UNSAFE_MODE)) {
    logger.error('WEB__JWT_SECRET is not set or too short.');
    logger.error('Increase the size to at least 32 characters');
    logger.error('You can by pass this security with UNSAFE_MODE env variable');
    process.exit(1);
  }

  router.use(jwt({ secret, isRevoked }));

  // Add perm to req.user
  router.use(am(async (req, res, next) => {
    const user = await authService.me(req.user.jit);
    req.user.permissions = user.permissions;
    next();
  }));

  return router;
}

module.exports = {
  authGuard,
};
