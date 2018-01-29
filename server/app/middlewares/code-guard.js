const logger = require('../../logger');
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
        throw createUserError('BadRequest', 'Missing body');
    }

    const code = req.body.code;

    if (!code) {
        throw createUserError('BadRequest', 'body.code is missing');
    }

    if (!await userService.checkCode(req.user.userId, code)) {
        throw createUserError('CodeError', 'The code provided is wrong');
    }

    logger.info(`Secure action at ${req.method} ${req.originalUrl} done by user id ${req.user.userId}`);
    next();
}

module.exports = {
    codeGuard
};
