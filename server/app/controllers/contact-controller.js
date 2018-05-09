const Joi = require('joi');
const mailService = require('../services/mail-service');
const { createServerError, createUserError } = require('../../utils');
const logger = require('../../logger');
const request = require('request');
const CONFIG = require('../../config/contactForm');

/**
 * Verify request and send form to the appropriate user(s).
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function sendForm(req, res) {
    const schema = Joi.object().keys({
        contactFormName: Joi.string().valid('concert', 'event', 'lost', 'website').required(),
        values: Joi.object().required(),
        token: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    var options = {
        method: 'POST',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        qs: {
            secret: CONFIG.RECAPTCHA.SECRET,
            response: req.body.token
        }
    };

    const verif = await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject();
            }
            resolve(JSON.parse(body));
        });
    }).catch(() => {
        logger.error('Error while captcha verification, %o', error);
        throw createServerError('captchaRequestFailed', 'reCaptcha request failed');
    });

    if (!verif.success) {
        logger.warn('Contact controller: captcha verification failed');
        throw createUserError('captchaVerificationFailed', 'reCaptcha verification failed');
    }

    try {
        switch (req.body.contactFormName) {
            case 'concert':
                await mailService.sendContactForm('concert', CONFIG.CONCERT_MAIL, req.body.values);
                break;
            case 'event':
                await mailService.sendContactForm('évenement', CONFIG.EVENT_MAIL, req.body.values);
                break;
            case 'lost':
                await mailService.sendContactForm('objet perdu', CONFIG.LOST_MAIL, req.body.values);
                break;
            case 'website':
                await mailService.sendContactForm('problème avec la K-App', CONFIG.WEBSITE_MAIL, req.body.values);
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
