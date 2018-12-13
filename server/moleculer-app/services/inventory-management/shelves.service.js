const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');

const model = {
  mongoose: mongoose.model('Shelves', mongoose.Schema({
    name: { type: String, required: true, min: 3 },
  })),
  joi: Joi.object({
    name: Joi.string().min(3).required(),
  }),
};

module.exports = {
  name: 'inventory-management.shelves',
  mixins: [DbMixin(model.mongoose), JoiDbActionsMixin(model.joi)],
};
