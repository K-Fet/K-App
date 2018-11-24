const DbService = require('moleculer-db');
// const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const mongoose = require('mongoose');
const Joi = require('joi');

const stockEventSchema = Joi.object({
  refProduct: Joi.number().integer().required(),
  diff: Joi.number().required(),
  type: Joi.string().valid('Transaction', 'InventoryAdjustment', 'Delivery'),
  refOrder: Joi.string(),
});

module.exports = {
  name: 'inventory-management.stock-events',
  mixins: [DbService],

  model: mongoose.model('StockEvent', mongoose.Schema({
    refProduct: { type: Number, required: true, min: 0 },
    diff: { type: Number, required: true },
    type: { type: String, required: true, enum: ['Transaction', 'InventoryAdjustment', 'Delivery'] },
    date: { type: Date, default: Date.now },
    refOrder: { type: String },
  })),

  actions: {
    create: {
      params: Joi.object({
        params: Joi.any(),
        query: Joi.any(),
        body: stockEventSchema.required(),
      }),
      async handler(ctx) {
        const entity = ctx.params.body;

        return this.validateEntity(entity)
        // Apply idField
          .then(e => this.adapter.beforeSaveTransformID(e, this.settings.idField))
          .then(e => this.adapter.insert(e))
          .then(doc => this.transformDocuments(ctx, {}, doc))
          .then(json => this.entityChanged('created', json, ctx).then(() => json));
      },
    },
  },
};
