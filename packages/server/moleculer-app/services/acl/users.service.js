const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Errors: { MoleculerClientError } } = require('moleculer');
const DbMixin = require('../../mixins/db-service.mixin');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const {
  createSchema, MONGO_ID, MONGOOSE_INTERNALS, verify,
} = require('../../../utils');

const LOGIN_ERROR = new MoleculerClientError('Bad email/password combination', 400, 'LoginError');

const { ObjectID } = mongoose.Schema.Types;

const model = {
  mongoose: mongoose.model('User', createSchema({
    email: {
      type: String, required: true, unique: true, lowercase: true,
    },
    password: { type: String },
    passwordToken: { type: String },
    emailToken: { type: String },
    accountType: {
      type: String, enum: ['SERVICE', 'BARMAN'], required: true, index: true,
    },
    account: {
      // Service account
      code: { type: String },
      description: { type: String },
      permissions: [{ type: String }],

      // Barman account
      firstName: { type: String },
      lastName: { type: String },
      nickName: { type: String },
      leaveAt: { type: Date, index: { sparse: true } },
      facebook: { type: String },
      godFather: { type: ObjectID },
      dateOfBirth: { type: Date },
      flow: { type: String },
      roles: [{ type: ObjectID, index: true }],
      kommissions: [{ type: ObjectID, index: true }],
    },
  }, { timestamps: true })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...MONGOOSE_INTERNALS,
    email: Joi.string().email().required(),
    password: Joi.string(),
    passwordToken: Joi.string(),
    emailToken: Joi.string(),
    accountType: Joi.string().valid(['SERVICE', 'BARMAN']).required(),
    account: Joi.alternatives()
      .when('accountType', {
        is: 'SERVICE',
        then: Joi.object({
          code: Joi.number().integer().min(4).max(6)
            .required(),
          description: Joi.string().required(),
          permissions: Joi.array().items(Joi.string()),
        }).required(),
      })
      .when('accountType', {
        is: 'BARMAN',
        then: Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nickName: Joi.string().required(),
          leaveAt: Joi.date().max('now').allow(null),
          facebook: Joi.string().regex(
            /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w-]*\/)*([\w\-.]+)(\/)?/i,
          ),
          dateOfBirth: Joi.date().required(),
          flow: Joi.string(),
          roles: Joi.array().items(MONGO_ID),
          kommissions: Joi.array().items(MONGO_ID),
        }).required(),
      }),
  }),
};

module.exports = {
  name: 'acl.users',
  version: 1,
  authorization: true,
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],
  hooks: {
    before: {
      // TODO Implement before hook
      // Need to remove any token present
      create: false,
      // TODO Implement before hook
      // Need to prevent any token edition (but keep existent)
      update: false,
    },
    after: {
      '*': ['removeSensitiveData'],
    },
  },

  methods: {
    removeSensitiveData(ctx, res) {
      const clear = item => ({
        ...item,
        password: undefined,
        passwordToken: undefined,
        emailToken: undefined,
      });

      if (res.rows) {
        res.rows = res.rows.map(clear);
        return res;
      }
      return clear(res);
    },
  },

  settings: {
    populates: {
      'account.roles': 'v1.acl.roles.get',
      'account.kommissions': 'v1.core.kommissions.get',
      // TODO Load services
      'account.services': async (ids, docs) => docs,
    },
  },

  actions: {
    find: true,
    count: true,
    list: true,
    insert: false,
    update: true,
    remove: true,
    create: true,

    // TODO Implement these
    resetPassword: false,
    definePassword: false,
    updateEmail: false,
    emailVerify: false,
    cancelEmailUpdate: false,

    authenticate: {
      visibility: 'protected',
      params: () => Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required(),
      }),
      async handler(ctx) {
        const { email, password } = ctx.params;

        const user = await this.adapter.findOne({ email });

        if (!user) throw LOGIN_ERROR;

        if (!user.password) {
          throw new MoleculerClientError('You must define password. Please, check your email.', 400, 'UndefinedPassword');
        }

        if (user.emailToken) {
          throw new MoleculerClientError('Your email is not verified yet, check your emails', 400, 'UnverifiedEmail');
        }

        if (!await verify(user.password, password)) throw LOGIN_ERROR;

        if (user.passwordToken) {
          user.passwordToken = null;
          await this._update(ctx, user);
        }

        return user;
      },
    },

    populateKommissions: {
      visibility: 'public',
      params: () => Joi.object({
        kommissionsIds: Joi.array().items(MONGO_ID).min(1).required(),
      }),
      async handler(ctx) {
        const { kommissionsIds } = ctx.params;

        const users = await this.adapter.find({
          accountType: 'BARMAN',
          'account.kommissions': { $in: kommissionsIds },
        });

        return Object.fromEntries(kommissionsIds.map((kId) => {
          const relatedUsers = users.filter(u => u.account.kommissions.includes(kId));
          return [kId, relatedUsers];
        }));
      },
    },

    populateRoles: {
      visibility: 'public',
      params: () => Joi.object({
        rolesIds: Joi.array().items(MONGO_ID).min(1).required(),
      }),
      async handler(ctx) {
        const { rolesIds } = ctx.params;

        const users = await this.adapter.find({
          accountType: 'BARMAN',
          'account.roles': { $in: rolesIds },
        });

        return Object.fromEntries(rolesIds.map((rId) => {
          const relatedUsers = users.filter(u => u.account.roles.includes(rId));
          return [rId, relatedUsers];
        }));
      },
    },
  },
};
