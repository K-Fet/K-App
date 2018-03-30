const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const EMAIL_CONFIG = require('../../config/mail');
const WEB_CONFIG = require('../../config/web');
const CONFIG = EMAIL_CONFIG[process.env.NODE_ENV || 'development'];

const readFile = promisify(fs.readFile);

/**
 * Send password reset mail
 *
 * @param email {String} recipient email address
 * @param token {String} passwordToken
 * @returns {Promise<void>} Nothing
 */
async function sendPasswordResetMail(email, token) {

    let mail = await readFile(path.resolve(__dirname, '../../resources/emails', 'reset-password.html'));

    mail = mail.replace(/{{\s*(\w)\s*}}/, (matches, replaceToken) => {
        switch (replaceToken) {
            case 'MAIL_WEBSITE':
                return WEB_CONFIG.publicURL;
            case 'MAIL_USERNAME':
                return email;
            case 'MAIL_LINK':
                return `${WEB_CONFIG.publicURL }/define-password?username=${email}&passwordToken=${token}`;
        }
    });

    const transporter = nodemailer.createTransport(CONFIG);
    // Setup email data with unicode symbols
    const mailOptions = {
        from: CONFIG.auth.user,
        to: email,
        subject: '[K-App] Réinitialisation du mot de passe',
        html: mail,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
}

/**
 * Send verify username mail
 *
 * @param email {String} recipient email address
 * @param token {String} usernameToken
 * @returns {Promise<void>} Nothing
 */
async function sendVerifyUsernameMail(email, token) {

    let mail = await readFile(path.resolve(__dirname, '../../resources/emails', 'verify-username.html'));

    mail = mail.replace(/{{\s*(\w)\s*}}/, (matches, replaceToken) => {
        switch (replaceToken) {
            case 'MAIL_WEBSITE':
                return WEB_CONFIG.publicURL;
            case 'MAIL_USERNAME':
                return email;
            case 'MAIL_LINK':
                return `${WEB_CONFIG.publicURL }/username-verification?username=${email}&usernameToken=${token}`;
        }
    });

    const transporter = nodemailer.createTransport(CONFIG);
    // Setup email data with unicode symbols
    const mailOptions = {
        from: CONFIG.auth.user,
        to: email,
        subject: '[K-App] Vérification du nom d\'utilisateur (adresse e-mail)',
        html: mail,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
}

/**
 * Send username update information
 *
 * @param email {String} recipient email address
 * @param token {String} passwordToken
 * @returns {Promise<void>} Nothing
 */
async function sendUsernameUpdateInformationMail(email, token) {

    let mail = await readFile(path.resolve(__dirname, '../../resources/emails', 'username-update-information.html'));

    mail = mail.replace(/{{\s*(\w)\s*}}/, (matches, replaceToken) => {
        switch (replaceToken) {
            case 'MAIL_WEBSITE':
                return WEB_CONFIG.publicURL;
            case 'MAIL_USERNAME':
                return email;
            case 'MAIL_LINK':
                return `${WEB_CONFIG.publicURL }/cancel-username-update?username=${email}&usernameToken=${token}`;
        }
    });

    const transporter = nodemailer.createTransport(CONFIG);
    // Setup email data with unicode symbols
    const mailOptions = {
        from: CONFIG.auth.user,
        to: email,
        subject: '[K-App] Information de changement de username (adresse email)',
        html: mail,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
}

/**
 * Send a confirmation after an username update.
 *
 * @param email {String} recipient email address
 * @returns {Promise<void>} Nothing
 */
async function sendUsernameConfirmation(email) {

    let mail = await readFile(path.resolve(__dirname, '../../resources/emails', 'username-confirm-change.html'));

    mail = mail.replace(/{{\s*(\w)\s*}}/, (matches, replaceToken) => {
        switch (replaceToken) {
            case 'MAIL_WEBSITE':
                return WEB_CONFIG.publicURL;
            case 'MAIL_USERNAME':
                return email;
        }
    });

    const transporter = nodemailer.createTransport(CONFIG);
    // Setup email data with unicode symbols
    const mailOptions = {
        from: CONFIG.auth.user,
        to: email,
        subject: '[K-App] Confirmation du changement d\'adresse email',
        html: mail,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
}


module.exports = {
    sendPasswordResetMail,
    sendVerifyUsernameMail,
    sendUsernameUpdateInformationMail,
    sendUsernameConfirmation,
};
