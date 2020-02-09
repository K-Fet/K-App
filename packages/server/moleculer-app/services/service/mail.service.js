const Joi = require('@hapi/joi');
const mailService = require('../../../app/services/mail-service');

module.exports = {
  name: 'service.mail',
  version: 1,

  actions: {
    passwordResetMail: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
    verifyEmailMail: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        userId: Joi.string().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
    emailUpdateInformationMail: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
        newEmail: Joi.string().email().required(),
        userId: Joi.string().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
    emailConfirmation: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
    welcomeMail: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
    cancelEmailConfirmation: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
    passwordUpdate: {
      visibility: 'public',
      params: () => Joi.object({
        email: Joi.string().email().required(),
      }),
      async handler(ctx) {
        return this.sendEmail(ctx);
      },
    },
  },

  methods: {
    async sendEmail(ctx) {
      const { name } = ctx.action;

      const service = `send${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      const fn = mailService[service];

      if (typeof fn !== 'function') {
        throw new Error('Unable to find this mail service');
      }

      await fn(ctx.params);
    },
  },
};
