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
        case 'MAIL_USERNAME':
          return email;
        case 'MAIL_LINK':
          return `${WEB_CONFIG.publicURL}/define-password?username=${email}&passwordToken=${encodeURIComponent(token)}`;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] (re)Définition du mot de passe', mail);
}

/**
 * Send verify username mail
 *
 * @param email {String} recipient email address
 * @param token {String} usernameToken
 * @param userId {Number} User id
 * @returns {Promise<void>} Nothing
 */
async function sendVerifyUsernameMail(email, token, userId) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.VERIFY_USERNAME)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_USERNAME':
          return email;
        case 'MAIL_LINK':
          return `${WEB_CONFIG.publicURL}/username-verification?userId=${userId}&username=${email}&usernameToken=${encodeURIComponent(token)}`;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Vérification du nom d\'utilisateur (adresse e-mail)', mail);
}

/**
 * Send username update information
 *
 * @param email {String} recipient email address
 * @param newEmail {String} updated email address
 * @param userId {Number} user id
 * @returns {Promise<void>} Nothing
 */
async function sendUsernameUpdateInformationMail(email, newEmail, userId) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.USERNAME_UPDATE_INFORMATION)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_USERNAME':
          return email;
        case 'MAIL_NEW_USERNAME':
          return newEmail;
        case 'MAIL_LINK':
          return `${WEB_CONFIG.publicURL}/cancel-username-update?userId=${userId}&username=${email}`;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Information de changement de username (adresse email)', mail);
}

/**
 * Send a confirmation after an username update.
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendUsernameConfirmation(email) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.USERNAME_CONFIRM_CHANGE)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_USERNAME':
          return email;
        default:
          return `??${replaceToken}??`;
      }
    });

  await sendMail(email, '[K-App] Confirmation du changement d\'adresse email', mail);
}

/**
 * Send a confirmation after a cancellation of an username update.
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendCancelUsernameConfirmation(email) {
  const mail = createMailTemplate(EMAIL_TEMPLATES.USERNAME_CHANGE_CANCEL_CONFIRMATION)
    .replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_WEBSITE':
          return WEB_CONFIG.publicURL;
        case 'MAIL_USERNAME':
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
      case 'MAIL_USERNAME':
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
async function sendContactFormV2(formName, emails, values) {
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
        case 'MAIL_USERNAME':
          return '{{ MAIL_USERNAME }}';
        default:
          return `??${replaceToken}??`;
      }
    });

  // eslint-disable-next-line
  for (const email of emails) {
    const currentMail = emailTemplate.replace(REGEX_TOKEN, (matches, replaceToken) => {
      switch (replaceToken) {
        case 'MAIL_USERNAME':
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
  sendVerifyUsernameMail,
  sendUsernameUpdateInformationMail,
  sendUsernameConfirmation,
  sendWelcomeMail,
  sendCancelUsernameConfirmation,
  sendContactFormV2,
};
