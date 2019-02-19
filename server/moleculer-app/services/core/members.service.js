const mongoose = require('mongoose');
const Joi = require('joi');
const JoiDbActionsMixin = require('../../mixins/joi-db-actions.mixin');
const DbMixin = require('../../mixins/db-service.mixin');
const {
  MONGO_ID, PARTIAL_MONGO_TIMESTAMP, JOI_STRING_OR_STRING_ARRAY, getCurrentSchoolYear,
} = require('../../../utils');

const model = {
  mongoose: mongoose.model('Members', mongoose.Schema({
    firstName: {
      type: String, required: true, min: 3, text: true,
    },
    lastName: {
      type: String, required: true, min: 3, text: true,
    },
    school: {
      type: String, min: 3, text: true,
    },
    registrations: [new mongoose.Schema({
      year: { type: Number, min: 2017, required: true },
      createdAt: { type: Date, default: Date.now, required: true },
    })],
  }, { timestamps: true })),
  joi: Joi.object({
    _id: MONGO_ID.strip(), // Remove _id from the object
    ...PARTIAL_MONGO_TIMESTAMP,
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    school: Joi.string().min(3),
    registrations: Joi.array().items(Joi.object({
      year: Joi.number().integer().greater(2017).required(),
      createdAt: Joi.date().strip(),
    })),
  }),
};

module.exports = {
  name: 'core.members',
  version: 1,
  mixins: [
    JoiDbActionsMixin(model.joi),
    DbMixin(model.mongoose),
  ],

  settings: {
    rest: 'v1/members/',
  },

  actions: {
    list: {
      params: () => Joi.object({
        active: Joi.bool(),
        inactive: Joi.bool(),
        populate: JOI_STRING_OR_STRING_ARRAY,
        fields: JOI_STRING_OR_STRING_ARRAY,
        page: Joi.number().integer().min(1),
        pageSize: Joi.number().integer().min(0),
        sort: Joi.string(),
        search: Joi.string(),
        searchField: JOI_STRING_OR_STRING_ARRAY,
        query: Joi.object(),
      }).oxor('active', 'inactive'),
      async handler(ctx) {
        const params = this.sanitizeParams(ctx, ctx.params);

        // Add scoped query
        if (params && params.active) {
          params.query = { 'registrations.year': getCurrentSchoolYear() };
        }
        if (params && params.inactive) {
          params.query = { 'registrations.year': { $ne: getCurrentSchoolYear() } };
        }

        const countParams = Object.assign({}, params);
        // Remove pagination params
        if (countParams && countParams.limit) countParams.limit = null;
        if (countParams && countParams.offset) countParams.offset = null;

        this.logger.debug('Calling members.list with %o', params);
        const [rows, count] = await Promise.all([this.adapter.find(params), this.adapter.count(countParams)]);
        return {
          rows: await this.transformDocuments(ctx, params, rows),
          total: count,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: Math.floor((count + params.pageSize - 1) / params.pageSize),
        };
      },
    },
  },
};
