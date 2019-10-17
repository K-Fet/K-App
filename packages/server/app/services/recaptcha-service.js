const rp = require('request-promise-native');
const conf = require('nconf');
const { createServerError, createUserError } = require('../../utils');
const logger = require('../../logger');

/**
 * Verify recaptcha token
 *
 * @returns {Promise<boolean>} Nothing
 */
async function recaptchaVerification(token) {
  const options = {
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    qs: {
      secret: conf.get('web:recaptchaSecret'),
      response: token,
    },
    json: true,
  };

  try {
    const res = await rp(options);
    if (!res.success) {
      logger.warn('Contact controller: captcha verification failed');
      throw createUserError('CaptchaVerificationFailed', 'reCaptcha verification failed');
    }
  } catch (error) {
    if (error.userError) {
      throw error;
    }
    throw createServerError('CaptchaRequestFailed', 'reCaptcha request failed');
  }
}

module.exports = {
  recaptchaVerification,
};
