const mongoose = require('mongoose');
const Joi = require('joi');
const { Errors } = require('moleculer');
const JoiDbActions = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { AVAILABLE_UNITS } = require('../../constants');

const { MoleculerClientError } = Errors;

const model = {
  mongoose: mongoose.model('StockEvent', mongoose.Schema({
    product: { type: String, required: true },
    diff: { type: Number, required: true },
    type: { type: String, required: true, enum: ['Transaction', 'InventoryAdjustment', 'Delivery'] },
    date: { type: Date, default: Date.now },
    meta: { type: String },
  })),
  joi: Joi.object({
    product: Joi.string().required(),
    diff: Joi.number().required(),
    date: Joi.date().max('now'),
    unit: Joi.string().length(1).default('u').valid(AVAILABLE_UNITS),
    type: Joi.string().valid('Transaction', 'InventoryAdjustment', 'Delivery').required(),
    meta: Joi.string(),
  }),
};

module.exports = {
  name: 'inventory-management.stock-events',
  mixins: [DbMixin(model.mongoose), JoiDbActions(model.joi)],

  settings: {
    populates: {
      product: 'inventory-management.products.get',
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

            if (event.unit === 'u') {
              conv = { coef: 1 };
            } else if (Array.isArray(product.conversions)) {
              conv = product.conversions.find(c => c.unit === event.unit);
            }

            if (!conv) {
              throw new MoleculerClientError(`Could not find valid conversion info for product '${product.name}' (tried to convert '${event.unit}')`);
            }

            return {
              ...event,
              diff: event.diff / conv.coef,
            };
          });

        const insertedEvents = await Promise.all(promises);

        // TODO Add an event to notify products that something is using it
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
