const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const EMAIL_CONFIG = require('../../config/mail');
const WEB_CONFIG = require('../../config/web');
const CONFIG = EMAIL_CONFIG[process.env.NODE_ENV || 'development'];

const readFile = promisify(fs.readFile);

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


module.exports = {
    sendPasswordResetMail,
};
