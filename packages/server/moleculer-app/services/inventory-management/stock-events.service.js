const mongoose = require('mongoose');
const Joi = require('joi');
const { Errors } = require('moleculer');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { BASE_UNIT } = require('../../constants');
const { MONGO_ID, UNIT_SCHEMA } = require('../../../utils');

const { MoleculerClientError } = Errors;

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

      async handler(ctx) {
        const event = ctx.params;
        const { product } = ctx.params;

        const productToUpdate = await ctx.call('inventory-management.products.get', { id: product });

        let conv;
        if (Array.isArray(productToUpdate.conversions)) {
          conv = productToUpdate.conversions.find(c => c.unit === event.unit);
        // eslint-disable-next-line brace-style
        }
        // If we could not find in the conversion array
        // and the event doesn't need custom unit
        // set default unit and coef
        else {
          conv = { coef: 1 };
        }
        conv = { coef: 1 }; // Don't use conversion, at all
        if (!conv) {
          throw new MoleculerClientError(`Could not find valid conversion info for product '${productToUpdate.name}' (tried to convert '${event.unit}')`);
        }

        const promise = {
          ...event,
          // Remove custom unit and convert to a single unit
          diff: event.diff / conv.coef,
        };

        const insertedEvents = await promise;

        this.logger.info(`Added ${insertedEvents.length} events into stock-events`);

        const res = await this.actions.insert({ entities: [insertedEvents] });

        ctx.emit('inventory-management.stock-events.added', res, ['inventory-management.products']);
        return res;
      },
    },

    // Must be called only via 'add' and 'delete' action
    insert: { visibility: 'private', permissions: false },

    // Disabled actions
    create: false,


    // Enable actions
    update: true,
  },
};
