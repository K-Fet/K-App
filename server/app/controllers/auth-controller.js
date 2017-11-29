const winston = require('winston');
const authService = require('../services/auth-service');

/**
 * Login a user by responding with a JWT.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function login(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email
            || typeof email !== 'string'
            || !password
            || typeof password !== 'string'
        ) {

            res.status(400).json({
                message: 'Bad request, the body has not the good structure {email: string, password: string).'
            });

            return res.end();
        }

        const jwt = await authService.login(email, password);

        res.json({
            jwt
        });
    } catch (e) {
        winston.error('Error while logging user', e);
        res.sendStatus(500);
    }

    return res.end();
}

/**
 * Logout a user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function logout(req, res) {
    try {
        await authService.logout(req.user.jit);
    } catch (e) {
        winston.error(`Error while logging out user ${req.user.id}`, e);
        res.sendStatus(500);
    }

    return res.end();
}

module.exports = {
    login,
    logout
};
