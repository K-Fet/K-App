const MailService = require('moleculer-mail');
const path = require('path');
const conf = require('nconf');

module.exports = {
  name: 'mail',

  mixins: [MailService],

  /**
   * Service settings
   */
  settings: {
    from: conf.get('mail:auth:user'),
    transport: conf.get('mail'),
    templateFolder: path.join(__dirname, '../../resources/mail/templates'),
  },
};
