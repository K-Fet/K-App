const authService = require('../services/auth-service');


/**
 * Login a user by responding with a JWT.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function login(req, res) {
  const { email, password, rememberMe } = req.body;

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
  const {
    email, password, oldPassword, passwordToken,
  } = req.body;

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
