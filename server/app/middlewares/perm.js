const authService = require('../services/auth-service');

/**
 * Permission middleware for express-jwt-permission
 * Add permissions array to req.user
 *
 * @returns {Promise<void>}
 */
module.exports = async function perm(req, res, next) {
  const user = await authService.me(req.user.jit);
  req.user.permissions = user.permissions;
  next();
};
