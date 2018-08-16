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
    email: Joi.string().required(),
    password: Joi.string().required(),
    rememberMe: Joi.number().integer().min(1).max(30),
  });

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);

  const { email, password, rememberMe = 1 } = req.body;

  const jwt = await authService.login(email, password, rememberMe);

  res.json({ jwt });
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
    email: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);

  await authService.resetPassword(req.body.email);

  res.send({});
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
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
      .error(createUserError(
        'WeakPassword',
        'Password must be at least 8 characters, with at least 1 uppercase, 1 lowercase and 1 digit',
      ))
      .required(),
    oldPassword: Joi.string().allow(null),
    passwordToken: Joi.string().allow(null),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    if (error.userError) throw error;

    throw createUserError('BadRequest', error.message);
  }

  const {
    email, password, oldPassword, passwordToken,
  } = req.body;

  if (!passwordToken && !oldPassword) {
    throw createUserError('BadRequest', 'Missing passwordToken or oldPassword field');
  }

  await authService.definePassword(email, passwordToken, password, oldPassword);

  res.send({});
}

/**
 * Verify an email.
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<void>} Nothing
 */
async function emailVerify(req, res) {
  const schema = Joi.object().keys({
    userId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    emailToken: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);

  const {
    userId, email, password, emailToken,
  } = req.body;
  await authService.emailVerify(userId, email, password, emailToken);

  res.send({});
}

/**
 * Cancel an email verification.
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<void>} Nothing
 */
async function cancelEmailVerify(req, res) {
  const schema = Joi.object().keys({
    userId: Joi.number().integer().required(),
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);

  const {
    userId, email,
  } = req.body;
  await authService.cancelEmailUpdate(userId, email);

  res.send({});
}

module.exports = {
  login,
  logout,
  resetPassword,
  definePassword,
  emailVerify,
  cancelEmailVerify,
};
