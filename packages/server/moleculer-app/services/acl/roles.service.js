const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID, MONGOOSE_INTERNALS, createSchema } = require('../../../utils');

const model = {
  mongoose: mongoose.model('Role', createSchema({
    name: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: String }],
  }, { timestamps: true }, { textIndex: ['name', 'description'] })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...MONGOOSE_INTERNALS,
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
    permissions: Joi.array().items(Joi.string().required()),
  }),
};

module.exports = {
  name: 'acl.roles',
  authorization: true,
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'roles'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/v1/roles',
    populates: {
      async barmen(ids, docs, rule, ctx) {
        const rolesIds = docs.map(d => d._id);

        const rMap = await ctx.call('v1.acl.users.populateRoles', { rolesIds });

        return docs.map(d => ({ ...d, barmen: rMap[d._id] }));
      },
    },
  },

  actions: {},
};
