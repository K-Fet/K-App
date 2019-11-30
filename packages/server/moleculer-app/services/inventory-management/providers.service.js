const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID } = require('../../../utils');

const model = {
  mongoose: mongoose.model('Providers', mongoose.Schema({
    name: {
      type: String, required: true, min: 3, text: true,
    },
    link: { type: String, text: true },
  }, { timestamps: true })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    name: Joi.string().min(3).required(),
    link: Joi.string().uri().allow(null),
  }),
};

module.exports = {
  name: 'inventory-management.providers',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'inventory-providers'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: '/v1/providers',
  },

  actions: {
    // TODO Safe delete
    remove: false,
  },
};
