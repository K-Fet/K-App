const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const conf = require('nconf');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const DbMixin = require('../../mixins/db-service.mixin');
const { JOI_ID, createSchema } = require('../../../utils');

const model = {
  mongoose: mongoose.model('JWT', createSchema({
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    // Auto delete token with default to one day
    expireAt: { type: Date, expires: 0 },
  }, { timestamps: true })),
};

module.exports = {
  name: 'acl.jwt',
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
    update: false,
    remove: false,

    create: {
      visibility: 'protected',
      params: () => Joi.object({
        userId: JOI_ID.required(),
        // Duration before revoked in minutes (default to 1 day)
        duration: Joi.number.integer().min(1).max(60 * 24 * 30).default(60 * 24),
      }),
      async handler(ctx) {
        const { userId, duration } = ctx.params;
        const id = uuidv4();
        const expiresIn = Math.floor(Date.now() / 1000) + (60 * duration);

        await this._create(ctx, {
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

    get: {
      visibility: 'protected',
      params: () => Joi.object({
        id: Joi.string().uuid().required(),
      }),
      async handler(ctx) {
        const { id } = ctx.params;

        return this._get(ctx, { id });
      },
    },

    revoke: {
      visibility: 'public',
      params: () => Joi.object({
        id: Joi.string().uuid().required(),
      }),
      async handler(ctx) {
        const { id } = ctx.params;

        await this.adapter.removeById(id);
      },
    },

    revokeAll: {
      visibility: 'public',
      params: () => Joi.object({
        userId: JOI_ID.required(),
      }),
      async handler(ctx) {
        const { userId } = ctx.params;

        this.logger.verbose(`Removing all current JWTs from user ${userId}`);

        await this.adapter.removeMany({ userId });
      },
    },
  },
};
