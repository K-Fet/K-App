const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID, MONGOOSE_INTERNALS, createSchema } = require('../../../utils');

const model = {
  mongoose: mongoose.model('Kommission', createSchema({
    name: { type: String, required: true },
    description: { type: String },
  }, { timestamps: true }, { textIndex: ['name', 'description'] })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...MONGOOSE_INTERNALS,
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
  }),
};

module.exports = {
  name: 'core.kommissions',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'kommissions'),
    DbMixin(model.mongoose),
  ],

  settings: {
    populates: {
      async barmen(ids, docs, rule, ctx) {
        const kommissionsIds = docs.map(d => d._id);

        const kMap = await ctx.call('v1.acl.users.populateKommissions', { kommissionsIds });

        return docs.map(d => ({ ...d, barmen: kMap[d._id] }));
      },
    },
  },

  actions: {},
};
