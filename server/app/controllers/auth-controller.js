const authService = require('../services/auth-service');
const { createUserError } = require('../../utils');


/**
 * Login a user by responding with a JWT.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email
        || typeof email !== 'string'
        || !password
        || typeof password !== 'string'
    ) {
        throw createUserError(
            'BadRequest',
            'The body has not the good structure {email: string, password: string).'
        );
    }

    const jwt = await authService.login(email, password);

    res.json({
        jwt
    });
}

/**
 * Logout a user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function logout(req, res) {
    await authService.logout(req.user.jit);

    res.sendStatus(200);
}

module.exports = {
    login,
    logout
};
