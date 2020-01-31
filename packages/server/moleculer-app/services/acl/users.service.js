const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Errors: { MoleculerClientError, MoleculerServerError } } = require('moleculer');
const DbMixin = require('../../mixins/db-service.mixin');
const DisableMixin = require('../../mixins/disable-actions.mixin');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const mailService = require('../../../app/services/mail-service');
const {
  createSchema, MONGO_ID, MONGOOSE_INTERNALS, verify, generateToken, hash, JOI_STRING_OR_STRING_ARRAY,
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
    email: Joi.string().lowercase().email().required(),
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
    DisableMixin(['insert']),
    JoiDbActionsMixin(model.joi, 'users'),
    DbMixin(model.mongoose),
  ],
  hooks: {
    before: {
      update: (ctx) => {
        const user = ctx.locals.entity;

        // Prevent any change to fixed fields
        [
          'password',
          'passwordToken',
          'emailToken',
          'accountType',
        ].forEach((field) => {
          ctx.params[field] = user[field];
        });
      },
      resetPassword: ['getUserByEmail'],
      definePassword: ['getUserByEmail'],
    },
    after: {
      '*': ['removeSensitiveData'],
    },
  },

  methods: {
    isEntityOwner(ctx) {
      const { _id } = ctx.meta.user;
      const { id } = ctx.params;

      return _id === id;
    },

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

    async getUserByEmail(ctx) {
      const { email } = ctx.params;

      const user = await this.adapter.findOne({ email });

      // Fail silently
      if (!user) return;

      ctx.locals.user = user;
    },
  },

  settings: {
    rest: '/v1/users',
    populates: {
      'account.roles': 'v1.acl.roles.get',
      'account.kommissions': 'v1.core.kommissions.get',
      async permissions(ids, docs, rule, ctx) {
        const roleIds = [...new Set([...docs
          .filter(d => d.accountType === 'BARMAN')
          .flatMap(d => d.account.roles),
        ]).entries()];

        const roles = await ctx.call('v1.acl.roles.get', { id: roleIds, mapping: true });

        docs.forEach((d) => {
          if (d.accountType === 'SERVICE') {
            // eslint-disable-next-line no-param-reassign
            d.permissions = d.account.permissions;
          } else if (d.accountType === 'BARMAN') {
            // eslint-disable-next-line no-param-reassign
            d.permissions = d.account.roles.flatMap(r => roles[r].permissions);
          }
        });
        return docs;
      },
    },
  },

  actions: {
    create: {
      // Remove some fields that should not be set now
      params: () => model.joi.keys({
        passwordToken: Joi.any().forbidden(),
        emailToken: Joi.any().forbidden(),
      }),
      async handler(ctx) {
        const { email } = ctx.params;

        const user = await this._create(ctx);

        await mailService.sendWelcomeMail(email);
        ctx.locals.entity = user;

        await ctx.call('v1.acl.users.resetPassword', { email });

        return user;
      },
    },

    list: {
      params: () => Joi.object({
        accountType: Joi.string().valid(['SERVICE', 'BARMAN']),
        onlyActive: Joi.boolean().default(false),
        populate: JOI_STRING_OR_STRING_ARRAY,
        fields: JOI_STRING_OR_STRING_ARRAY,
        page: Joi.number().integer().min(1),
        pageSize: Joi.number().integer().min(0),
        sort: Joi.string(),
        search: Joi.string(),
        searchField: JOI_STRING_OR_STRING_ARRAY,
        // Remove query as it may be a security issue if published
        query: Joi.object().forbidden(),
      }),
      async handler(ctx) {
        const params = this.sanitizeParams(ctx, ctx.params);

        if (params.accountType) {
          params.query = { accountType: params.accountType };
        }

        if (params.onlyActive && params.accountType === 'BARMAN') {
          params.query.$or = [
            { 'account.leaveAt': { $exists: false } },
            { 'account.leaveAt': { $gt: new Date() } },
          ];
        }

        return this._list(ctx, params);
      },
    },

    update: {
      async handler(ctx) {
        // In case of change of email, create a emailToken and send emails
        const { email: currentEmail } = ctx.locals.entity;
        const { passwordToken, email, _id } = ctx.params;
        if (currentEmail !== email) {
          if (passwordToken) {
            throw new MoleculerClientError('You must define a password. Please, check your email.', 400, 'UndefinedPassword');
          }

          const emailToken = await generateToken(128);

          ctx.params.emailToken = await hash(emailToken + email);
          ctx.params.email = currentEmail;

          try {
            await mailService.sendVerifyEmailMail(email, emailToken, _id);
            await mailService.sendEmailUpdateInformationMail(currentEmail, email, _id);
          } catch (err) {
            this.logger.error('Error while sending reset password mail at %s or %s, %o', currentEmail, email, err);
            throw new MoleculerServerError('Unable to send email to the provided address', 500, 'MailerError');
          }
        }

        return this._update(ctx);
      },
    },

    me: {
      rest: 'GET /me',
      params: () => Joi.object({}),
      async handler(ctx) {
        ctx.params.id = ctx.meta.user.id;
        return this._get(ctx);
      },
    },

    resetPassword: {
      rest: 'POST /reset-password',
      authorization: false,
      params: () => Joi.object({
        email: Joi.string().email().lowercase().required(),
      }),
      async handler(ctx) {
        const { user } = ctx.locals;

        if (user.emailToken) {
          throw new MoleculerClientError('A valid email is required to reset the password', 400, 'UnverifiedEmail');
        }

        const passwordToken = await generateToken(128);

        try {
          await mailService.sendPasswordResetMail(user.email, passwordToken);
        } catch (err) {
          this.logger.error('Error while sending reset password mail at %s, %o', user.email, err);

          throw new MoleculerServerError('Unable to send email to the provided address', 500, 'MailerError');
        }

        await this.adapter.updateById(user._id, {
          $set: {
            passwordToken: await hash(passwordToken),
          },
        });
      },
    },

    definePassword: {
      rest: 'POST /define-password',
      authorization: false,
      params: () => Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
          .error(new MoleculerClientError(
            'Password must be at least 8 characters, with at least 1 uppercase, 1 lowercase and 1 digit',
            400,
            'WeakPassword',
          ))
          .required(),
        oldPassword: Joi.string(),
        passwordToken: Joi.string(),
      }).xor('oldPassword', 'passwordToken'),
      async handler(ctx) {
        const { user } = ctx.locals;
        const { password, passwordToken, oldPassword } = ctx.params;

        if (passwordToken) {
          if (!user.passwordToken) {
            throw new MoleculerClientError('passwordToken database value is null for the provided user', 400, 'NoPasswordToken');
          }
          if (!await verify(user.passwordToken, passwordToken)) {
            throw new MoleculerClientError('Provided password token has not been found for this user', 400, 'UnknownPasswordToken');
          }
        } else if (oldPassword) {
          if (!await verify(user.password, oldPassword)) {
            throw LOGIN_ERROR;
          }
        }

        if (user.emailToken) {
          throw new MoleculerClientError(
            'A verified email is required, if you can not gain access to your account, contact an administrator',
            400,
            'UnverifiedEmail',
          );
        }

        await this.adapter.updateById(user._id, {
          $set: {
            password: await hash(password),
            passwordToken: null,
          },
        });

        try {
          await mailService.sendPasswordUpdate(user.email);
        } catch (e) {
          this.logger.warn('Error while sending password update mail');
        }

        await ctx.call('v1.acl.auth.revokeAll', { userId: user._id });
      },
    },

    emailVerify: {
      rest: 'POST /email-verify',
      authorization: false,
      params: () => Joi.object({
        userId: MONGO_ID.required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required(),
        emailToken: Joi.string().required(),
      }),
      async handler(ctx) {
        const {
          userId, email, password, emailToken,
        } = ctx.params;

        const user = await this.adapter.findById(userId);

        if (!user
          || !await verify(user.password, password)
          || !await verify(user.emailToken, emailToken + email)
        ) {
          throw new MoleculerClientError('Bad token/password/new email combination.', 400, 'VerificationError');
        }

        await this.adapter.updateById(userId, { $set: { email, emailToken: null } });

        try {
          await mailService.sendEmailConfirmation(email);
        } catch (err) {
          this.logger.error('Error while sending a confirmation for email update for %s, %o', email, err);
        }

        await ctx.call('v1.acl.auth.revokeAll', { userId: user._id });
      },
    },

    cancelEmailUpdate: {
      rest: 'POST /cancel-email-update',
      params: () => Joi.object({
        userId: MONGO_ID.required(),
      }),
      async handler(ctx) {
        const { userId } = ctx.params;
        const { email } = ctx.meta.user;
        const user = await this.adapter.findById(userId);

        if (!user) {
          throw new MoleculerClientError('No user found for this user id.', 400, 'VerificationError');
        }

        await this.adapter.updateById(userId, { $set: { emailToken: null } });

        try {
          await mailService.sendCancelEmailConfirmation(email);
        } catch (err) {
          this.logger.error('Error while sending a confirmation for email update for %s, %o', email, err);
        }
      },
    },

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
