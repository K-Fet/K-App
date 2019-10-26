const mongoose = require('mongoose');
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
    get: false,
    update: false,
    remove: false,
    create: false,

    login: {},

  },
};
