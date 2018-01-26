const userService = require('../services/user-service');
const { createUserError } = require('../../utils');

/**
 * Code guard.
 *
 * Require a field `code` in the body of the request.
 *
 * @returns {Promise<void>}
 */
async function codeGuard(req, res, next) {
    if (!req.body) {
        throw createUserError('BadRequest', 'Empty body');
    }

    const code = req.body.code;

    if (!code) {
        throw createUserError('BadRequest', 'body.code is missing');
    }

    if (!await userService.checkCode(req.user.connection, code)) {
        throw createUserError('CodeError', 'The code provided is wrong');
    }

    next();
}

module.exports = {
    codeGuard
};
