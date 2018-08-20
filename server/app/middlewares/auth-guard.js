const { Router } = require('express');
const jwt = require('express-jwt');
const logger = require('../../logger');
const am = require('../../utils/async-middleware');
const authService = require('../services/auth-service');

const { jwtSecret } = require('../../config/jwt');
const { PERMISSION_LIST } = require('../../config/permissions');
const { isTokenRevoked } = require('../services/auth-service');

/**
 * Check if the provided JWT is revoked or not.
 *
 * @param req Request
 * @param payload {Object} JWT Payload
 * @param done Callback
 */
async function isRevokedCallback(req, { jit }, done) {
  try {
    const isRevoked = await isTokenRevoked(jit);
    done(null, !!isRevoked);
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

  return router;
}

module.exports = {
  authGuard,
};
