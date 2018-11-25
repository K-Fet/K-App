const Joi = require('joi');

module.exports = function joiDbActions(joiModel) {
  return {
    actions: {
      find: {
        permissions: true,
        params: Joi.object({
          populate: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          fields: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          limit: Joi.number().integer().min(0),
          offset: Joi.number().integer().min(0),
          sort: Joi.string(),
          search: Joi.string(),
          searchField: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          query: Joi.object(),
        }),
      },
      count: {
        permissions: true,
        params: Joi.object({
          search: Joi.string(),
          searchFields: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          query: Joi.object(),
        }),
      },
      list: {
        permissions: true,
        params: Joi.object({
          populate: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          fields: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          page: Joi.number().integer().min(1),
          pageSize: Joi.number().integer().min(0),
          sort: Joi.string(),
          search: Joi.string(),
          searchField: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          query: Joi.object(),
        }),
      },
      create: {
        permissions: true,
        params: joiModel,
      },
      insert: {
        permissions: true,
        params: Joi.object({
          entities: Joi.array().items(joiModel),
          entity: joiModel,
        }).without('entities', 'entity'),
      },
      get: {
        permissions: true,
        params: Joi.object({
          id: Joi.alt(
            Joi.string(),
            Joi.number(),
            Joi.array(),
          ).required(),
          populate: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          fields: Joi.alt(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          mapping: Joi.bool(),
        }),
      },
      update: {
        permissions: true,
        params: joiModel,
      },
      remove: {
        permissions: true,
        params: Joi.object({
          id: Joi.alt(
            Joi.string(),
            Joi.number(),
            Joi.array(),
          ).required(),
        }),
      },
    },
  };
};
