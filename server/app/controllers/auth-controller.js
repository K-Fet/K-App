const Joi = require('joi');
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
    const schema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details.message);


    const { username, password } = req.body;

    const jwt = await authService.login(username, password);

    res.json({
        jwt
    });
}

/**
 * Refresh a token while revoking the current one.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function refresh(req, res) {
    const jwt = await authService.refresh(req.user.jit);

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

    res.send({});
}

/**
 * Send information about the connected user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<{ barman: Barman, specialAccount: SpecialAccount}>} The connected user's information
 */
async function me(req, res) {
    const user = await authService.me(req.user.jit);

    res.send(user);
}

module.exports = {
    login,
    logout,
    refresh,
    me
};
