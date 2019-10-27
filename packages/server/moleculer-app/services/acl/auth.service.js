const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const DbMixin = require('../../mixins/db-service.mixin');
const { createSchema } = require('../../../utils');

const model = {
  mongoose: mongoose.model('JWT', createSchema({
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    // Auto delete token with default to one day
    expireAt: { type: Date, expires: 0 },
  }, { timestamps: true })),
};

module.exports = {
  name: 'acl.auth',
  version: 1,
  mixins: [
    DbMixin(model.mongoose),
  ],

  settings: {},

  actions: {
    find: false,
    count: false,
    list: false,
    insert: false,
    get: false,
    update: false,
    remove: false,
    create: false,

    login: {
      rest: 'POST /login',
      params: () => Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        rememberMe: Joi.number().min(1).max(60 * 24 * 30).default(60 * 24),
      }),
      async handler(ctx) {
        const { email, password, rememberMe } = ctx.params;

        const user = await ctx.call('v1.acl.users.authenticate', { email, password });

        return ctx.call('v1.acl.jwt.create', { userId: user._id, duration: rememberMe });
      },
    },

    logout: {
      rest: 'GET /logout',
      authorization: true,
      params: () => Joi.object({}),
      async handler(ctx) {
        const { jit } = ctx.meta;

        await ctx.call('v1.acl.jwt.revoke', { id: jit });
      },
    },

  },
};
