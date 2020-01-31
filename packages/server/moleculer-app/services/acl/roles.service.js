const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { xor } = require('lodash');
const { Errors: { MoleculerClientError } } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DisableMixin = require('../../mixins/disable-actions.mixin');
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
    DisableMixin(['insert']),
    JoiDbActionsMixin(model.joi, 'roles'),
    DbMixin(model.mongoose),
  ],

  hooks: {
    before: {
      update: ['hasEnoughPermissions'],
      create: ['hasEnoughPermissions'],
    },
  },

  methods: {
    // Prevent adding/removing permissions that the user
    // does not have
    hasEnoughPermissions(ctx) {
      const { userPermissions } = ctx.meta;
      const { permissions: newPermissions } = ctx.params;
      const { entity } = ctx.locals;

      const diff = xor(entity ? entity.permissions : [], newPermissions);

      if (diff.some(p => !userPermissions.include(p))) {
        throw new MoleculerClientError('Tried to set permissions that you don\'t have', 400, 'NotEnoughPermissions');
      }
    },
  },

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
