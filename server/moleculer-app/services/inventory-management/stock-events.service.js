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
    product: { type: mongoose.Schema.Types.ObjectId, required: true },
    diff: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, required: true, enum: ['Transaction', 'InventoryAdjustment', 'Delivery'] },
    order: { type: mongoose.Schema.Types.ObjectId },
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
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],

  settings: {
    populates: {
      product: 'inventory-management.products.get',
      order: 'inventory-management.orders.get',
    },
  },

  actions: {
    add: {
      permissions: true,
      params: () => Joi.object({
        entities: Joi.array().items(model.joi),
        entity: model.joi,
      }).without('entities', 'entity'),
      async handler(ctx) {
        const events = ctx.params.entities || [ctx.params.entity];

        const promises = events
        // Get product
          .map(e => ({
            productP: ctx.call('inventory-management.product.get', { id: e.product }),
            event: e,
          }))
          // Convert sent unit
          .map(async ({ productP, event }) => {
            const product = await productP;

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

        // Notify products because products are considered used now
        ctx.emit('inventory-management.stock-events.added', insertedEvents, ['inventory-management.products']);
        return this.actions.insert(insertedEvents);
      },
    },

    // Must be called only via 'add' action
    insert: { visibility: 'private' },

    // Disabled actions
    create: false,
    update: false,
    remove: false,
  },
};
