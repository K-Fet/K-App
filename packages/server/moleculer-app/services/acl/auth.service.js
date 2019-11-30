const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const uuidv4 = require('uuid/v4');
const conf = require('nconf');
const jwt = require('jsonwebtoken');
const DbMixin = require('../../mixins/db-service.mixin');
const DisableMixin = require('../../mixins/disable-actions.mixin');
const { createSchema, MONGO_ID } = require('../../../utils');

const model = {
  mongoose: mongoose.model('JWT', createSchema({
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    // Auto deletes token with default to one day
    expireAt: { type: Date, expires: 0 },
  }, { timestamps: true })),
};

module.exports = {
  name: 'acl.auth',
  version: 1,
  mixins: [
    DisableMixin(true),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/v1/auth',
  },

  actions: {
    check: {
      visibility: 'protected',
      params: () => Joi.object({
        id: Joi.string().uuid().required(),
      }),
      async handler(ctx) {
        const { id } = ctx.params;

        return this._get(ctx, { id });
      },
    },

    login: {
      rest: 'POST /login',
      authorization: false,
      params: () => Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        rememberMe: Joi.number().min(1).max(60 * 24 * 30).default(60 * 24),
      }),
      async handler(ctx) {
        const { email, password, rememberMe } = ctx.params;

        const user = await ctx.call('v1.acl.users.authenticate', { email, password });

        return this.create({ userId: user._id, duration: rememberMe });
      },
    },

    logout: {
      rest: 'GET /logout',
      authorization: true,
      params: () => Joi.object({}),
      async handler(ctx) {
        const { jit } = ctx.meta;

        await this.adapter.removeById(jit);
      },
    },

    revokeAll: {
      visibility: 'protected',
      authorization: false,
      params: () => Joi.object({
        userId: MONGO_ID.required(),
      }),
      async handler(ctx) {
        const { userId } = ctx.params;

        this.logger.verbose(`Removing all current JWTs from user ${userId}`);

        await this.adapter.removeMany({ userId });
      },
    },
  },

  method: {
    async create({ userId, duration }) {
      const id = uuidv4();
      const expiresIn = Math.floor(Date.now() / 1000) + (60 * duration);

      await this._create(this.currentContext, {
        _id: id,
        userId,
        expireAt: new Date(expiresIn),
      });

      this.logger.verbose(`Creating a new JWT ${userId}`);

      return jwt.sign({
        jit: id,
        expiresIn,
        userId,
      }, conf.get('web:jwtSecret'));
    },
  },
};
