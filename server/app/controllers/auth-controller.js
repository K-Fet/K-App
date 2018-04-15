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
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);


    const { username, password } = req.body;

    const jwt = await authService.login(username, password);

    res.json({
        jwt,
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
        jwt,
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
 * Request a password reset.
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<void>} Nothing
 */
async function resetPassword(req, res) {
    const schema = Joi.object().keys({
        username: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    await authService.resetPassword(req.body.username);

    res.sendStatus(200);
}

/**
 * Define a password after reset request.
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<void>} Nothing
 */
async function definePassword(req, res) {
    const schema = Joi.object().keys({
        username: Joi.string().email().required(),
        password: Joi.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
            .error(createUserError('WeakPassword',
                'Password must be at least 8 characters, with at least 1 uppercase, 1 lowercase and 1 digit'))
            .required(),
        oldPassword: Joi.string(),
        passwordToken: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        if (error.userError) throw error;

        throw createUserError('BadRequest', error.message);
    }

    const { username, password, oldPassword, passwordToken } = req.body;

    if (!passwordToken && !oldPassword) {
        throw createUserError('BadRequest', 'Missing passwordToken or oldPassword field');
    }

    await authService.definePassword(username, passwordToken, password, oldPassword);

    res.sendStatus(200);
}

/**
 * Verify an username.
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<void>} Nothing
 */
async function usernameVerify(req, res) {
    const schema = Joi.object().keys({
        userId: Joi.number().integer().required(),
        username: Joi.string().email().required(),
        password: Joi.string().required(),
        usernameToken: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    const { userId, username, password, usernameToken } = req.body;
    await authService.usernameVerify(userId, username, password, usernameToken);

    res.sendStatus(200);
}


module.exports = {
    login,
    logout,
    refresh,
    resetPassword,
    definePassword,
    usernameVerify,
};
