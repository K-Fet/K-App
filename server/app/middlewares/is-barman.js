const authService = require('../services/auth-service');
const { createUserError } = require('../../utils');

/**
 * Check if connected user is a barman.
 *
 * Add req.barman.
 *
 * @returns {Promise<void>}
 */
async function isBarman(req, res, next) {
    const user = await authService.me(req.user.jit);
    if (user.specialAccount) next(createUserError('BadRequest', 'SpecialAccount does not have services'));

    req.barman = user.barman;
    next();
}

module.exports = {
    isBarman
};
