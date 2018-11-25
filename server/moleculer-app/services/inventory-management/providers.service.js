const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');

const model = {
  mongoose: mongoose.model('Providers', mongoose.Schema({
    name: { type: String, required: true, min: 3 },
    link: { type: String },
  })),
  joi: Joi.object({
    name: Joi.string().min(3).required(),
    link: Joi.string().uri(),
  }),
};

module.exports = {
  name: 'inventory-management.providers',
  mixins: [DbService, JoiDbActionsMixin(model.joi)],
  adapter: new MongooseAdapter('mongodb://localhost/moleculer-demo', { useNewUrlParser: true }),

  model: model.mongoose,
};
