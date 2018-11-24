const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const mongoose = require('mongoose');
const Joi = require('joi');

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
  mixins: [DbService],
  adapter: new MongooseAdapter('mongodb://localhost/moleculer-demo', { useNewUrlParser: true }),

  model: model.mongoose,

  actions: {
    find: {
      permissions: ['inventory-management:providers:find'],
    },
    count: {},
    list: {
      permissions: ['inventory-management:providers:list'],
    },
    create: {
      params: model.joi,
    },
    insert: {},
    get: {},
    update: {
      params: model.joi,
    },
    remove: {},
  },
};
