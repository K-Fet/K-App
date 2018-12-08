const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActions = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');

const model = {
  mongoose: mongoose.model('StockEvent', mongoose.Schema({
    product: { type: Number, required: true, min: 0 },
    diff: { type: Number, required: true },
    type: { type: String, required: true, enum: ['Transaction', 'InventoryAdjustment', 'Delivery'] },
    date: { type: Date, default: Date.now },
    refOrder: { type: String },
  })),
  joi: Joi.object({
    product: Joi.number().integer().required(),
    diff: Joi.number().required(),
    type: Joi.string().valid('Transaction', 'InventoryAdjustment', 'Delivery'),
    refOrder: Joi.string(),
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
};
