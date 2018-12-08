const Joi = require('joi');

const JOI_ID = Joi.alt(
  Joi.string(),
  Joi.number(),
  Joi.array(),
);
const JOI_STRING_OR_STRING_ARRAY = Joi.alt(
  Joi.string(),
  Joi.array().items(Joi.string()),
);

module.exports = function joiDbActions(joiModel) {
  return {
    actions: {
      find: {
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
        permissions: true,
        params: () => Joi.object({
          search: Joi.string(),
          searchFields: JOI_STRING_OR_STRING_ARRAY,
          query: Joi.object(),
        }),
      },
      list: {
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
        permissions: true,
        params: () => joiModel,
      },
      insert: {
        permissions: true,
        params: () => Joi.object({
          entities: Joi.array().items(joiModel),
          entity: joiModel,
        }).without('entities', 'entity'),
      },
      get: {
        permissions: true,
        params: () => Joi.object({
          id: JOI_ID.required(),
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          mapping: Joi.bool(),
        }),
      },
      update: {
        permissions: true,
        params: () => joiModel.append({
          id: JOI_ID.required(),
        }),
      },
      remove: {
        permissions: true,
        params: () => Joi.object({
          id: JOI_ID.required(),
        }),
      },
    },
  };
};
