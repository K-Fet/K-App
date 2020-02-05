const path = require('path');
const MoleculerMail = require('@k-fet/moleculer-mail');
const conf = require('nconf');

module.exports = {
  name: 'service.mail',
  version: 1,
  mixins: [MoleculerMail],

  settings: {
    // Email template config (https://github.com/niftylettuce/email-templates/)
    template: {
      transport: conf.get('mail'),
      views: { root: path.join(__dirname, '../../../resources/mail/templates') },
      message: {
        from: conf.get('mail:auth:user'),
      },
    },
    locals: {
      _website: conf.get('web:clientUrl'),
    },
  },
};
