const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');

const model = {
  mongoose: mongoose.model('Products', mongoose.Schema({
    name: { type: String, required: true, min: 3 },
    provider : {type: Number, require: true },
    shelf : {type : Number, require: true},
    shipping_mode : {type : String, require : true, enum: ['Volume', 'Individually']},
    shipping_size : {type : String, require: true},
    image: {type: String},
  })),
  joi: Joi.object({
    name: Joi.string().min(3).required(),
    provider: Joi.number().required(),
    shelf : Joi.number().required(),
    shipping_mode: Joi.string().allow('Volume', 'Individually').required(),
    shipping_size : Joi.string().required(),
    image: Joi.string().uri(),
  }),
};

module.exports = {
  name: 'inventory-management.products',
  mixins: [DbMixin(model.mongoose), JoiDbActionsMixin(model.joi)],

  settings: {
    populates: {
      provider: 'inventory-management.providers.get',
      shelf : 'inventory-management.shelves.get',
    },
  },
};
