const fs = require('fs');
const path = require('path');

function getEmailContent(name) {
  return fs.readFileSync(path.join(__dirname, 'emails', `${name}.html`), 'utf8');
}

const HEADER = getEmailContent('header');
const FOOTER = getEmailContent('footer');

const CONTACT = getEmailContent('contact');
const RESET_PASSWORD = getEmailContent('reset-password');
const EMAIL_CONFIRM_CHANGE = getEmailContent('email-confirm-change');
const EMAIL_CHANGE_CANCEL_CONFIRMATION = getEmailContent('email-change-cancel-confirmation');
const EMAIL_UPDATE_INFORMATION = getEmailContent('email-update-information');
const VERIFY_EMAIL = getEmailContent('verify-email');
const WELCOME = getEmailContent('welcome');
const PASSWORD_UPDATE = getEmailContent('password-update');

module.exports = {
  HEADER,
  FOOTER,
  CONTACT,
  RESET_PASSWORD,
  EMAIL_CONFIRM_CHANGE,
  EMAIL_UPDATE_INFORMATION,
  VERIFY_EMAIL,
  EMAIL_CHANGE_CANCEL_CONFIRMATION,
  WELCOME,
  PASSWORD_UPDATE,
};
