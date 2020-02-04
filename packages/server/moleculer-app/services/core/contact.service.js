const Joi = require('@hapi/joi');
const conf = require('nconf');
const { flatten } = require('../../../utils');
const TRANSLATIONS = require('../../../resources/contact-form-field-translations');
const recaptchaService = require('../../../app/services/recaptcha-service');

const CONTACTS = {
  concert: { title: 'Concert' },
  event: { title: 'Évenement | soirée' },
  lost: { title: 'Objet perdu' },
  website: { title: 'Problème avec la K-App' },
};

module.exports = {
  name: 'core.contact',
  version: 1,

  settings: {
    rest: 'v1/contact',
  },

  actions: {
    send: {
      params: () => Joi.object({
        contactFormName: Joi.valid('concert', 'event', 'lost', 'website').required(),
        values: Joi.object().required(),
        token: Joi.string().required(),
      }),
      async handler(ctx) {
        // TODO Remove after migration
        await recaptchaService.recaptchaVerification(ctx.params.token);
        const { contactFormName, values } = ctx.params;

        const form = CONTACTS[contactFormName];

        const email = conf.get(`mail:contact:${contactFormName}`);
        const data = {
          form, values: flatten(values), email, TRANSLATIONS,
        };

        await this.sendMail(ctx, email, data);
      },
    },
  },
  methods: {
    /**
     * Send email to the user email address
     *
     * @param {Context} ctx
     * @param {string} email
     * @param {Object?} data
     */
    async sendMail(ctx, email, data) {
      try {
        return await ctx.call('v1.service.mail.send', {
          message: { to: email },
          template: 'contact',
          data,
        }, { retries: 3, timeout: 5000 });
      } catch (err) {
        this.logger.error('Unable to send contact mail!', err);
        throw err;
      }
    },
  },
};
