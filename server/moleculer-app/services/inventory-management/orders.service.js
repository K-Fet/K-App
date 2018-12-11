const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');

const model = {
  mongoose: mongoose.model('Orders', mongoose.Schema({
    reference: { type: String, required: true, min: 3 },
    provider : {type: Number, require: true },
    date : {type: Date, default: Date.now()},
    state :{type: String, enum:['EN COURS', 'RECUE']},
    listProducts : {type : Array, require: true},
  })),
  joi: Joi.object({
    reference: Joi.string().required().min(3),
    provider : Joi.number().required(),
    date : Joi.date(),
    state : Joi.string().valid('EN COURS', 'RECUE'),
    listProducts : Joi.array().required(),
 }),
};

module.exports = {
  name: 'inventory-management.orders',
  mixins: [DbMixin(model.mongoose), JoiDbActionsMixin(model.joi)],

  settings: {
    populates: {
      provider: 'inventory-management.providers.get',
      listProducts : 'inventory-management.ordered-products.get'
    },
  },
};
