const Joi = require('@hapi/joi');
const { JOI_ID, JOI_STRING_OR_STRING_ARRAY } = require('../../utils');

module.exports = function joiDbActions(joiModel) {
  return {
    actions: {
      find: {
        rest: 'GET /find',
        permissions: true,
        params: () => Joi.object({
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          limit: Joi.number().integer().min(0),
          offset: Joi.number().integer().min(0),
          sort: Joi.string(),
          search: Joi.string(),
          searchField: JOI_STRING_OR_STRING_ARRAY,
          query: Joi.object(),
        }),
      },
      count: {
        rest: 'GET /count',
        permissions: true,
        params: () => Joi.object({
          search: Joi.string(),
          searchFields: JOI_STRING_OR_STRING_ARRAY,
          query: Joi.object(),
        }),
      },
      list: {
        rest: 'GET /',
        permissions: true,
        params: () => Joi.object({
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          page: Joi.number().integer().min(1),
          pageSize: Joi.number().integer().min(0),
          sort: Joi.string(),
          search: Joi.string(),
          searchField: JOI_STRING_OR_STRING_ARRAY,
          query: Joi.object(),
        }),
      },
      create: {
        rest: 'POST /',
        permissions: true,
        params: () => joiModel,
      },
      insert: {
        rest: 'POST /insert',
        permissions: true,
        params: () => Joi.object({
          entities: Joi.array().items(joiModel),
          entity: joiModel,
        }).without('entities', 'entity'),
      },
      get: {
        rest: 'GET /:id',
        permissions: true,
        params: () => Joi.object({
          id: JOI_ID.required(),
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          mapping: Joi.bool(),
        }),
      },
      update: {
        rest: 'PUT /:id',
        permissions: true,
        params: () => joiModel.append({
          id: JOI_ID.required(),
        }),
      },
      remove: {
        rest: 'DELETE /:id',
        permissions: true,
        params: () => Joi.object({
          id: JOI_ID.required(),
        }),
      },
    },
  };
};
