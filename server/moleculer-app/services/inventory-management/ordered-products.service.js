const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');

const model = {
  mongoose: mongoose.model('OrderedProduct', mongoose.Schema({
    product : { type: Number, required: true},
    quantity : { type: Number, required: true, min: 0},
    realQuantity : { type: Number},
  })),
  joi: Joi.object({
    product: Joi.number().required(),
    quantity : Joi.number().min(0).required(),
    realQuantity : Joi.number(),
  }),
};

module.exports = {
  name: 'inventory-management.ordered-products',
  mixins: [DbMixin(model.mongoose), JoiDbActionsMixin(model.joi)],

  settings: {
    populates: {
      product: 'inventory-management.products.get',
    },
  },
};
