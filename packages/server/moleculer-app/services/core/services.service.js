const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID, createSchema } = require('../../../utils');

const { ObjectID } = mongoose.Schema.Types;

const model = {
  mongoose: mongoose.model('Services', createSchema({
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    nbMax: { type: Number, min: 1, default: 1 },
    barmen: [{ type: ObjectID, index: true }],
  })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    __v: Joi.number().integer(),
    startAt: Joi.date().iso().required(),
    endAt: Joi.date().iso().min(Joi.ref('startAt')).required(),
    barmen: Joi.array().items(MONGO_ID),
    nbMax: Joi.number().integer().min(1),
  }),
};

module.exports = {
  name: 'core.services',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'services'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: 'v1/services/',
  },

  actions: {},
};
