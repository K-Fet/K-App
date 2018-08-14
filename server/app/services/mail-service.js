const nodemailer = require('nodemailer');
const EMAIL_CONFIG = require('../../config/mail');
const WEB_CONFIG = require('../../config/web');

const CONFIG = EMAIL_CONFIG[process.env.NODE_ENV || 'development'];
const TRANSLATION = require('../../resources/contact-form-field-translations');
const EMAIL_TEMPLATES = require('../../resources/email-templates');

const REGEX_TOKEN = /{{\s*([a-zA-Z_]+)\s*}}/g;

/**
 * Create mail template from ressource
 *
 * @param emailBody {String} mail body from ressources/email/body.js
 * @returns {String} mail template
 */
function createMailTemplate(emailBody) {
  return EMAIL_TEMPLATES.HEADER + emailBody + EMAIL_TEMPLATES.FOOTER;
}

/**
 * Create mail template from ressource
 *
 * @param to {String} email address
 * @param subject {String} mail subject
 * @param html {String} mail content with html tag
 * @returns {Promise<void>} Nothing
 */
async function sendMail(to, subject, html) {
  const transporter = nodemailer.createTransport(CONFIG);

  const mailOptions = {
    from: CONFIG.auth.user,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Send password reset mail
 *
 * @param email {String} recipient email address
 * @param token {String} passwordToken
 * @returns {Promise<void>} Nothing
 */
async function sendPasswordResetMail(email, token) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.RESET_PASSWORD)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_EMAIL':
          return email;
        case 'MAIL_LINK':
          return `${WEB_CONFIG.publicURL}/define-password?email=${email}&passwordToken=${encodeURIComponent(token)}`;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] (re)Définition du mot de passe', mail);
}

/**
 * Send verify email mail
 *
 * @param email {String} recipient email address
 * @param token {String} emailToken
 * @param userId {Number} User id
 * @returns {Promise<void>} Nothing
 */
async function sendVerifyEmailMail(email, token, userId) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.VERIFY_EMAIL)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_EMAIL':
          return email;
        case 'MAIL_LINK':
          return `${WEB_CONFIG.publicURL}/email-verification?userId=${userId}&email=${email}&emailToken=${encodeURIComponent(token)}`;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Vérification du nom d\'utilisateur (adresse email)', mail);
}

/**
 * Send email update information
 *
 * @param email {String} recipient email address
 * @param newEmail {String} updated email address
 * @param userId {Number} user id
 * @returns {Promise<void>} Nothing
 */
async function sendEmailUpdateInformationMail(email, newEmail, userId) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.EMAIL_UPDATE_INFORMATION)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_EMAIL':
          return email;
        case 'MAIL_NEW_EMAIL':
          return newEmail;
        case 'MAIL_LINK':
          return `${WEB_CONFIG.publicURL}/cancel-email-update?userId=${userId}&email=${email}`;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Information de changement d\'adresse email', mail);
}

/**
 * Send a confirmation after an email update.
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendEmailConfirmation(email) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.EMAIL_CONFIRM_CHANGE)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_EMAIL':
          return email;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Confirmation du changement d\'adresse email', mail);
}

/**
 * Send a confirmation after an password update.
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendPasswordUpdate(email) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.PASSWORD_UPDATE)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_EMAIL':
          return email;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Confirmation du changement de mot de passe', mail);
}

/**
 * Send a confirmation after a cancellation of an email update.
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendCancelEmailConfirmation(email) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.EMAIL_CHANGE_CANCEL_CONFIRMATION)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_EMAIL':
          return email;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Confirmation de l\'annulation du changement d\'adresse email', mail);
}

/**
 * Send a welcome mail
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendWelcomeMail(email) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.WELCOME).replace(REGEX_TOKEN, (matches, replaceToken) => {
    switch (replaceToken) {
      case 'MAIL_WEBSITE':
        return WEB_CONFIG.publicURL;
      case 'MAIL_EMAIL':
        return email;
      default:
        return `??${replaceToken}??`;
    }
  });

  await sendMail(email, '[K-App] Bienvenue sur l\'application', mail);
}

/**
 * Send contact form mail
 *
 * @param formName {String} Form name in lower case (because of email subject implementation)
 * @param emails {String} emails receiver
 * @param values {Object} Key/value pairs representing form values
 * @returns {Promise<void>} Nothing
 */
async function sendContactForm(formName, emails, values) {
  const emailTemplate = createMailTemplate(EMAIL_TEMPLATES.CONTACT)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'FORM_NAME':
          return formName;
        case 'FORM_VALUES': {
          let html = '<p><ul>';
          Object.keys(values).forEach((value) => {
            html += `<li><b>${TRANSLATION[value] ? TRANSLATION[value].french : value}</b>: ${values[value]}</li>`;
          });
          html += '</ul></p>';
          return html;
        }
        case 'MAIL_EMAIL':
          return '{{ MAIL_EMAIL }}';
        default:
          return `??${replaceToken}??`;
      }
    });

  // eslint-disable-next-line
  for (const email of emails) {
    const currentMail = emailTemplate.replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_EMAIL':
          return email;
        default:
          return `??${replaceToken}??`;
      }
    });

    // eslint-disable-next-line
    await sendMail(email, `[K-App] Nouveau formulaire de contact pour un ${formName}`, currentMail);
  }
}

module.exports = {
  sendPasswordResetMail,
  sendVerifyEmailMail,
  sendEmailUpdateInformationMail,
  sendEmailConfirmation,
  sendWelcomeMail,
  sendCancelEmailConfirmation,
  sendContactForm,
  sendPasswordUpdate,
};
