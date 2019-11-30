const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const DisableMixin = require('../../mixins/disable-actions.mixin');
const { BASE_UNIT } = require('../../constants');
const { MONGO_ID, UNIT_SCHEMA } = require('../../../utils');

const { MoleculerClientError } = Errors;

const model = {
  mongoose: mongoose.model('StockEvent', mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    diff: { type: Number, required: true },
    date: { type: Date, default: Date.now, index: true },
    type: {
      type: String, required: true, enum: ['Transaction', 'InventoryAdjustment', 'Delivery'], index: true,
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
    type: Joi.string().valid('Transaction', 'InventoryAdjustment', 'Delivery').required(),
    order: MONGO_ID,
    meta: Joi.string(),
  }),
};

module.exports = {
  name: 'inventory-management.stock-events',
  mixins: [
    DisableMixin(['create', 'update', 'remove']),
    JoiDbActionsMixin(model.joi, 'inventory-stock-events'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/stock-events',
    populates: {
      product: 'inventory-management.products.get',
      order: 'inventory-management.orders.get',
    },
  },

  actions: {
    add: {
      rest: 'POST /',
      permissions: [
        'inventory-stock-events.create',
      ],
      params: () => Joi.object({
        entities: Joi.array().items(model.joi),
        entity: model.joi,
      }).without('entities', 'entity'),
      async handler(ctx) {
        const events = ctx.params.entities || [ctx.params.entity];

        const ids = [...new Set(events.map(e => e.product)).keys()];
        const products = await ctx.call('inventory-management.products.get', { id: ids, mapping: true });

        const promises = events
          // Get product
          .map(async (event) => {
            const product = products[event.product];

            let conv;

            if (Array.isArray(product.conversions)) {
              conv = product.conversions.find(c => c.unit === event.unit);
            }
            // If we could not find in the conversion array
            // and the event doesn't need custom unit
            // set default unit and coef
            if (!conv && event.unit === BASE_UNIT) {
              conv = { coef: 1 };
            }


            if (!conv) {
              throw new MoleculerClientError(`Could not find valid conversion info for product '${product.name}' (tried to convert '${event.unit}')`);
            }

            return {
              ...event,
              // Remove custom unit and convert to a single unit
              unit: undefined,
              diff: event.diff / conv.coef,
            };
          });

        const insertedEvents = await Promise.all(promises);

        this.logger.info(`Added ${insertedEvents.length} events into stock-events`);

        const res = await this._insert({ entities: insertedEvents });

        // Notify products because products are considered used now
        ctx.emit('inventory-management.stock-events.added', res, ['inventory-management.products']);
        return res;
      },
    },
  },
};
