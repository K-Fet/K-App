const conf = require('nconf');
const mailService = require('../services/mail-service');
const recaptchaService = require('../services/recaptcha-service');
const { createUserError } = require('../../utils');
const logger = require('../../logger');

/**
 * Verify request and send form to the appropriate user(s).
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function sendForm(req, res) {
  await recaptchaService.recaptchaVerification(req.body.token);

  try {
    switch (req.body.contactFormName) {
      case 'concert':
        await mailService.sendContactForm('concert', conf.get('mail:contact:concert'), req.body.values);
        break;
      case 'event':
        await mailService.sendContactForm('évenement | soirée', conf.get('mail:contact:event'), req.body.values);
        break;
      case 'lost':
        await mailService.sendContactForm('objet perdu', conf.get('mail:contact:lost'), req.body.values);
        break;
      case 'website':
        await mailService.sendContactForm('problème avec la K-App', conf.get('mail:contact:website'), req.body.values);
        break;
      default:
        break;
    }
  } catch (err) {
    logger.error('Error while sending contact form, %o', err);
    throw createUserError('MailerError', 'Unable to send email to the provided address');
  }

  res.json();
}

module.exports = {
  sendForm,
};
