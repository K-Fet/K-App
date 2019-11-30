const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const { MONGO_ID, MONGOOSE_INTERNALS, createSchema } = require('../../../utils');

const getMongooseDayFields = (prefix = '') => ({
  [`${prefix}Day`]: {
    type: Number, required: true, min: 1, max: 7,
  },
  [`${prefix}Hours`]: {
    type: Number, required: true, min: 0, max: 23,
  },
  [`${prefix}Minutes`]: {
    type: Number, required: true, min: 0, max: 59,
  },
});

const getJoiDayFields = (prefix = '') => ({
  [`${prefix}Day`]: Joi.number().integer().min(1).max(7)
    .required(),
  [`${prefix}Hours`]: Joi.number().integer().min(0).max(23)
    .required(),
  [`${prefix}Minutes`]: Joi.number().integer().min(0).max(59)
    .required(),
});

const model = {
  mongoose: mongoose.model('ServicesTemplates', createSchema({
    name: { type: Date, required: true },
    services: [{
      nbMax: { type: Number, default: 3 },
      ...getMongooseDayFields('start'),
      ...getMongooseDayFields('end'),
    }],
  }, { timestamp: true }, { textIndex: ['name'] })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...MONGOOSE_INTERNALS,
    name: Joi.string().trim().required(),
    services: Joi.array().items(Joi.object({
      nbMax: Joi.number().integer().min(1),
      ...getJoiDayFields('start'),
      ...getJoiDayFields('end'),
    }).min(1).required()),
  }),
};

module.exports = {
  name: 'core.services-templates',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi, 'services-templates'),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: 'v1/services-templates/',
  },

  actions: {},
};
