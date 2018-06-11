const { createServerError, createUserError } = require('../../utils');
const CONFIG = require('../../config/contactForm');
const rp = require('request-promise-native');
const logger = require('../../logger');

/**
 * Verify recaptcha token
 *
 * @returns {Promise.<void>} Nothing
 */
async function recaptchaVerification(token) {
  const options = {
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    qs: {
      secret: CONFIG.RECAPTCHA.SECRET,
      response: token,
    },
    json: true,
  };

  return rp(options)
    .then((res) => {
      if (!res.success) {
        logger.warn('Contact controller: captcha verification failed');
        throw createUserError('captchaVerificationFailed', 'reCaptcha verification failed');
      }
    })
    .catch((error) => {
      logger.error('Error while captcha verification, %o', error);
      throw createServerError('captchaRequestFailed', 'reCaptcha request failed');
    });
}

module.exports = {
  recaptchaVerification,
};
