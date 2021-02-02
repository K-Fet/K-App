const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { BASE_UNIT } = require('../../constants');
const { MONGO_ID, UNIT_SCHEMA } = require('../../../utils');


const model = {
  mongoose: mongoose.model('StockEvent', mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    diff: { type: Number, required: true },
    date: { type: Date, default: Date.now, index: true },
    type: {
      type: String, required: true, enum: ['Transaction', 'InventoryAdjustment', 'InventoryUpdate', 'Delivery'], index: true,
    },
    order: { type: mongoose.Schema.Types.ObjectId, index: true },
    meta: { type: String },
  })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    product: MONGO_ID.required(),
    diff: Joi.number().required(),
    date: Joi.date().max('now'),
    unit: UNIT_SCHEMA.default(BASE_UNIT),
    type: Joi.string().valid('Transaction', 'InventoryAdjustment', 'InventoryUpdate', 'Delivery').required(),
    order: MONGO_ID.allow(null),
    meta: Joi.string().allow(null),
  }),
};

module.exports = {
  name: 'inventory-management.stock-events',
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/stock-events',
    populates: {
      product: 'inventory-management.products.get',
      order: 'inventory-management.orders.get',
    },
    maxPageSize: 1000,
  },

  actions: {
    add: {
      rest: 'POST /',
      permissions: true,
      params: () => Joi.object({
        entities: Joi.array().items(model.joi),
        entity: model.joi,
      }).without('entities', 'entity'),
      async handler(ctx) {
        const events = ctx.params.entities || [ctx.params.entity];

        const ids = [...new Set(events.map(e => e.product)).keys()];
        await ctx.call('inventory-management.products.get', { id: ids, mapping: true });

        this.logger.info(`Added ${events.length} events into stock-events`);

        const res = await this.actions.insert({ entities: events });

        // Notify products because products are considered used now
        ctx.emit('inventory-management.stock-events.added', res, ['inventory-management.products']);
        return res;
      },
    },

    // Must be called only via 'add' action
    insert: { visibility: 'private', permissions: false },

    // Disabled actions
    create: false,
  },
};
