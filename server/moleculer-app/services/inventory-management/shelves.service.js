const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID } = require('../../../utils');

const model = {
  mongoose: mongoose.model('Shelves', mongoose.Schema({
    name: {
      type: String, required: true, min: 3, text: true,
    },
  })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    name: Joi.string().min(3).required(),
  }),
};

module.exports = {
  name: 'inventory-management.shelves',
  mixins: [JoiDbActionsMixin(model.joi), DbMixin(model.mongoose)],

  actions: {
    // TODO Safe delete
    remove: false,
  },
};
