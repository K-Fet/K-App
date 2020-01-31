const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Errors: { MoleculerClientError } } = require('moleculer');
const { isBefore } = require('date-fns');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const {
  MONGO_ID, createSchema, JOI_ID, JOI_STRING_OR_STRING_ARRAY, RANGE_SCHEMA,
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
    listBarman: {
      rest: 'GET /barmen/:id',
      permissions: [
        'services.read',
        'barmen.read',
        // A barman can see its own services
        ctx => ctx.meta.user._id === ctx.params.id,
      ],
      params: () => Joi.object({
        ...RANGE_SCHEMA,
        id: JOI_ID.required(),
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

        return this._list(ctx, {
          ...params,
          query: { barmen: { $elemMath: ctx.params.id } },
        });
      },
    },

    addBarman: {
      rest: 'POST /barmen/:id',
      permissions: [
        'services.write',
        // A barman can add services
        ctx => ctx.meta.user._id === ctx.params.id,
      ],
      params: () => Joi.object({
        services: Joi.array().items(JOI_ID).min(1).required(),
        id: JOI_ID.required(),
      }),
      async handler(ctx) {
        const { id, services } = ctx.params;
        const barman = await ctx.call('v1.acl.users.get', { id });

        if (barman.accountType !== 'BARMAN') {
          throw new MoleculerClientError('Only barmen can be added to a service', 400, 'NotBarman');
        }

        if (barman.account.leaveAt && isBefore(barman.account.leaveAt, new Date())) {
          throw new MoleculerClientError('This barman is not active at the moment', 400, 'NotActiveBarman');
        }

        const existing = await this.adapter.findByIds(services);

        if (existing.length !== services.length) {
          throw new MoleculerClientError(`Could not find ${existing.length - services.length} services.`, 400, 'UnknownService');
        }

        return this.adapter.updateMany(
          { _id: { $in: services } },
          { $push: { barmen: id } },
        );
      },
    },

    removeBarman: {
      rest: 'POST /barmen/:id/remove',
      permissions: [
        'services.write',
        // A barman can add services
        ctx => ctx.meta.user._id === ctx.params.id,
      ],
      params: () => Joi.object({
        services: Joi.array().items(JOI_ID).min(1).required(),
        id: JOI_ID.required(),
      }),
      async handler(ctx) {
        const { id, services } = ctx.params;
        const barman = await ctx.call('v1.acl.users.get', { id });

        if (barman.accountType !== 'BARMAN') {
          throw new MoleculerClientError('Only barmen can be added to a service', 400, 'NotBarman');
        }

        if (barman.account.leaveAt && isBefore(barman.account.leaveAt, new Date())) {
          throw new MoleculerClientError('This barman is not active at the moment', 400, 'NotActiveBarman');
        }

        const existing = await this.adapter.findByIds(services);

        if (existing.length !== services.length) {
          throw new MoleculerClientError(`Could not find ${existing.length - services.length} services.`, 400, 'UnknownService');
        }

        return this.adapter.updateMany(
          { _id: { $in: services } },
          { $pull: { barmen: id } },
        );
      },
    },

    listBarmen: {
      rest: 'GET /barmen',
      permissions: [
        'services.read',
        'barmen.read',
      ],
      params: () => Joi.object(RANGE_SCHEMA),
      async handler(ctx) {
        const { rows: activeBarmen } = await ctx.call('v1.acl.users.list', {
          onlyActive: true,
          accountType: 'BARMAN',
          pageSize: 1000,
        });

        const params = this.sanitizeParams(ctx, ctx.params);
        const { rows: services } = await this._list(ctx, {
          ...params,
          pageSize: 10000,
          query: {
            barmen: { $elemMath: { $in: activeBarmen.map(b => b._id) } },
          },
        });

        return activeBarmen.map(b => ({
          ...b,
          account: {
            ...b.account,
            services: services.filter(s => s.barmen.includes(b._id)),
          },
        }));
      },
    },

    list: {
      params: () => Joi.object({
        ...RANGE_SCHEMA,
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

        params.query = {
          startAt: { $gte: params.startAt },
          endAt: { $lte: params.endAt },
        };
        return this._list(ctx, params);
      },
    },
  },
};
