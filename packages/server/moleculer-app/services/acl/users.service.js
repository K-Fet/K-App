const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const DbMixin = require('../../mixins/db-service.mixin');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const { createSchema, MONGO_ID, MONGOOSE_INTERNALS } = require('../../../utils');

const model = {
  mongoose: mongoose.model('User', createSchema({
    email: {
      type: String, required: true, unique: true, lowercase: true,
    },
    password: { type: String },
    passwordToken: { type: String },
    emailToken: { type: String },
    accountType: { type: String, enum: ['SERVICE', 'BARMAN'], required: true },
    account: { type: Number, required: true }, // Foreign key
  }, { timestamps: true })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...MONGOOSE_INTERNALS,
    email: Joi.string().email().required(),
    password: Joi.string(),
    passwordToken: Joi.string(),
    emailToken: Joi.string(),
  }),
};

module.exports = {
  name: 'acl.users',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],
  hooks: {
    after: {
      '*': (ctx, res) => {
        delete res.password;
        delete res.passwordToken;
        delete res.emailToken;
        return res;
      },
    },
  },

  settings: {
    populates: {
      async account(ids, docs) {
        return Promise.all(docs.map(async (doc) => {
          switch (doc.accountType) {
            case 'SERVICE':
            case 'BARMAN':
              // TODO Load related account
              // eslint-disable-next-line no-param-reassign
              doc.account = 'TBD';
              break;
            default:
              break;
          }
        }));
      },
    },
  },

  actions: {
    find: false,
    count: false,
    list: false,
    insert: false,
    update: false,
    remove: false,
    create: false,
  },
};
