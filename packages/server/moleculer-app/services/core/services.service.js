const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const {
  MONGO_ID, createSchema, JOI_ID, JOI_STRING_OR_STRING_ARRAY,
} = require('../../../utils');

const { ObjectID } = mongoose.Schema.Types;

const model = {
  mongoose: mongoose.model('Services', createSchema({
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    nbMax: { type: Number, min: 1, default: 1 },
    barmen: [{ type: ObjectID, index: true }],
  })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    __v: Joi.number().integer(),
    startAt: Joi.date().iso().required(),
    endAt: Joi.date().iso().min(Joi.ref('startAt')).required(),
    barmen: Joi.array().items(MONGO_ID),
    nbMax: Joi.number().integer().min(1),
  }),
};

module.exports = {
  name: 'core.services',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'services'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: 'v1/services/',
    populates: {
      async barmen(ids, docs, rule, ctx) {
        const allBarmen = docs.flatMap(d => d.barmen);
        const barmen = await ctx.call('v1.acl.users.get', { id: allBarmen, mapping: true });

        return docs.map(d => ({ ...d, barmen: d.barmen.map(id => barmen[id]) }));
      },
    },
  },

  actions: {
    barman: {
      rest: 'GET /barman/:id',
      permissions: [
        'services.read',
        'barmen.read',
        // A barman can see its own services
        ctx => ctx.meta.user._id === ctx.params.id,
      ],
      params: () => Joi.object({
        populate: JOI_STRING_OR_STRING_ARRAY,
        fields: JOI_STRING_OR_STRING_ARRAY,
        page: Joi.number().integer().min(1),
        pageSize: Joi.number().integer().min(0),
        sort: Joi.string(),
        search: Joi.string(),
        searchField: JOI_STRING_OR_STRING_ARRAY,
        id: JOI_ID.required(),
      }),
      async handler(ctx) {
        const params = this.sanitizeParams(ctx, ctx.params);
        return this._list(ctx, {
          ...params,
          query: { barmen: { $elemMath: ctx.params.id } },
        });
      },
    },
  },
};
