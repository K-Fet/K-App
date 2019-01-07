const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');

const model = {
  mongoose: mongoose.model('Providers', mongoose.Schema({
    name: {
      type: String, required: true, min: 3, text: true,
    },
    link: { type: String, text: true },
  })),
  joi: Joi.object({
    name: Joi.string().min(3).required(),
    link: Joi.string().uri().allow(null),
  }),
};

module.exports = {
  name: 'inventory-management.providers',
  mixins: [DbMixin(model.mongoose), JoiDbActionsMixin(model.joi)],

  actions: {
    // TODO Safe delete
    remove: false,
  },
};
