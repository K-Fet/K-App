const Joi = require('joi');
const conf = require('nconf');
const recaptchaService = require('../../app/services/recaptcha-service');
const TRANSLATIONS = require('../../resources/contact-form-field-translations');
const { flatten } = require('../../utils');

module.exports = {
  name: 'contact',

  mixins: [],

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

        let formName = '';
        switch (contactFormName) {
          case 'concert':
            formName = 'Concert';
            break;
          case 'event':
            formName = 'Évenement | soirée';
            break;
          case 'lost':
            formName = 'Objet perdu';
            break;
          case 'website':
            formName = 'Problème avec la K-App';
            break;
          default:
            return;
        }

        const email = conf.get(`mail:contact:${contactFormName}`);
        const data = {
          formName, values: flatten(values), email, TRANSLATIONS,
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
        return await ctx.call(this.settings.actions.sendMail, {
          to: email,
          template: 'contact',
          data,
        }, { retries: 3, timeout: 5000 });
      } catch (err) {
        this.logger.error('Unable to send contact mail!', err);
        throw err;
      }
    },
  },

  /**
   * Service settings
   */
  settings: {
    actions: {
      sendMail: 'mail.send',
    },
  },
};
