const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { xor } = require('lodash');
const { Errors: { MoleculerClientError, MoleculerServerError } } = require('moleculer');
const DbMixin = require('../../mixins/db-service.mixin');
const DisableMixin = require('../../mixins/disable-actions.mixin');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
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
      autoUpgradePermissions: { type: Boolean, default: false }, // Always false
      description: { type: String },
      permissions: { type: [String], default: undefined },

      // Barman account
      firstName: { type: String },
      lastName: { type: String },
      nickName: { type: String },
      leaveAt: { type: Date, index: { sparse: true } },
      facebook: { type: String },
      godFather: { type: ObjectID },
      dateOfBirth: { type: Date },
      flow: { type: String },
      roles: { type: [ObjectID], index: { sparse: true }, default: undefined },
      kommissions: { type: [ObjectID], index: { sparse: true }, default: undefined },
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
          code: Joi.string().min(4).max(6).regex(/^[0-9]+$/, 'numbers')
            .required(),
          // Cannot be updated from here
          autoUpgradePermissions: Joi.boolean().strip(),
          description: Joi.string().required(),
          permissions: Joi.array().items(Joi.string()).default([]),
        }).required(),
      })
      .when('accountType', {
        is: 'BARMAN',
        then: Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nickName: Joi.string().required(),
          leaveAt: Joi.date().allow(null),
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
      create: ['limitToServiceAccounts'],
      update: [
        (ctx) => {
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
        'limitToServiceAccounts',
      ],
      remove: ['limitToServiceAccounts'],
      resetPassword: ['getUserByEmail'],
      definePassword: ['getUserByEmail'],
      authenticate: ['getUserByEmail'],
    },
    after: {
      '*': ['removeSensitiveData'],
    },
  },

  methods: {
    isEntityOwner(ctx) {
      if (!ctx.meta.user) return false;

      const { _id } = ctx.meta.user;
      const { id } = ctx.params;

      return _id === id;
    },

    // For actions create, remove and update
    // If accountType === SERVICE limit to service account
    // Also prevent a service account to edit itself (unless special perm) or add itself more perm
    // than it currently have
    limitToServiceAccounts(ctx) {
      const { accountType: currentType } = ctx.meta.user;
      const { accountType } = ctx.locals.entity || ctx.params;

      if (accountType !== 'SERVICE') return;

      if (currentType !== 'SERVICE') {
        throw new MoleculerClientError('Only a service account can update another one', 400, 'NotServiceAccount');
      }

      const allowedPermissions = ctx.meta.userPermissions;
      const diff = ctx.locals.entity
        ? xor(ctx.locals.entity.account.permissions, ctx.params.account.permissions)
        : ctx.params.account.permissions;

      if (diff.some(p => !allowedPermissions.includes(p))) {
        throw new MoleculerClientError('Tried to set permissions that you don\'t have', 400, 'NotEnoughPermissions');
      }
    },

    removeSensitiveData(ctx, res) {
      const clear = (item) => {
        const clean = { ...item };
        delete clean.password;
        delete clean.passwordToken;
        delete clean.emailToken;
        return clean;
      };

      if (!res) return res;
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

      ctx.locals.user = user.toJSON();
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
          .flatMap(d => d.account.roles)
          .map(r => r.toString()),
        ]).entries()];

        const roles = roleIds.length ? await ctx.call('v1.acl.roles.get', { id: roleIds, mapping: true }) : {};

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
        password: Joi.any().forbidden(),
        passwordToken: Joi.any().forbidden(),
        emailToken: Joi.any().forbidden(),
      }),
      async handler(ctx) {
        const { email } = ctx.params;

        const user = await this._create(ctx, ctx.params);

        ctx.locals.user = user;

        await this.actions.resetPassword({ email });

        await ctx.call('v1.service.mail.welcomeMail', { email }, { retries: 3, timeout: 5000 });

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
        const { passwordToken, email, id } = ctx.params;
        if (currentEmail !== email) {
          if (passwordToken) {
            throw new MoleculerClientError('You must define a password. Please, check your email.', 400, 'UndefinedPassword');
          }

          const emailToken = await generateToken(128);

          ctx.params.emailToken = await hash(emailToken + email);
          ctx.params.email = currentEmail;

          try {
            await ctx.call('v1.service.mail.verifyEmailMail', { email, token: emailToken, userId: id }, {
              retries: 3, timeout: 5000,
            });

            await ctx.call('v1.service.mail.emailUpdateInformationMail', {
              email: currentEmail,
              newEmail: email,
              userId: id,
            }, { retries: 3, timeout: 5000 });
          } catch (err) {
            this.logger.error('Error while sending reset password mail at %s or %s, %o', currentEmail, email, err);
            throw new MoleculerServerError('Unable to send email to the provided address', 500, 'MailerError');
          }
        }

        return this._update(ctx, ctx.params);
      },
    },

    me: {
      rest: 'GET /me',
      permissions: [],
      params: () => Joi.object({}),
      async handler(ctx) {
        ctx.params = {
          id: ctx.meta.user._id,
          populate: ['permissions'],
        };
        return this._get(ctx, ctx.params);
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
        const { email } = ctx.params;

        // Fail silently
        if (!user) return;

        if (user.emailToken) {
          // TODO Send a mail saying that you need to validate email first
          throw new MoleculerClientError('A valid email is required to reset the password', 400, 'UnverifiedEmail');
        }

        const passwordToken = await generateToken(128);

        try {
          await ctx.call('v1.service.mail.passwordResetMail', { email, token: passwordToken }, {
            retries: 3, timeout: 5000,
          });
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
        const {
          password, passwordToken, oldPassword, email,
        } = ctx.params;

        const baseError = new MoleculerClientError('Unable to define password', 400, 'InvalidRequest');

        if (passwordToken) {
          if (!user || !user.passwordToken) {
            this.logger.info(`Define password action rejected for email ${email} because no password token`);
            throw baseError;
          }
          if (!await verify(user.passwordToken, passwordToken)) {
            this.logger.info(`Define password action rejected for email ${email} because invalid password token`);
            throw baseError;
          }
        } else if (oldPassword) {
          if (!user || !await verify(user.password, oldPassword)) {
            throw LOGIN_ERROR;
          }
        }

        if (user.emailToken) {
          this.logger.warn(`Define password action rejected for user ${user._id} because email token already defined`);
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
          await ctx.call('v1.service.mail.passwordUpdate', { email: user.email }, { retries: 3, timeout: 5000 });
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
          await ctx.call('v1.service.mail.emailConfirmation', { email: user.email }, { retries: 3, timeout: 5000 });
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
          await ctx.call('v1.service.mail.cancelEmailConfirmation', { email: user.email }, {
            retries: 3, timeout: 5000,
          });
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
        const { password } = ctx.params;
        const { user } = ctx.locals;

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
