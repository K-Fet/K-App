const Joi = require('@hapi/joi');
const { JOI_ID, JOI_STRING_OR_STRING_ARRAY } = require('../../utils');


const actionValidators = {
  find: Joi.object({
    populate: JOI_STRING_OR_STRING_ARRAY,
    fields: JOI_STRING_OR_STRING_ARRAY,
    limit: Joi.number().integer().min(0),
    offset: Joi.number().integer().min(0),
    sort: Joi.string(),
    search: Joi.string(),
    searchField: JOI_STRING_OR_STRING_ARRAY,
    // Remove query as it may be a security issue if published
    query: Joi.object().forbidden(),
  }),
  count: Joi.object({
    search: Joi.string(),
    searchFields: JOI_STRING_OR_STRING_ARRAY,
    // Remove query as it may be a security issue if published
    query: Joi.object().forbidden(),
  }),
  list: Joi.object({
    populate: JOI_STRING_OR_STRING_ARRAY,
    fields: JOI_STRING_OR_STRING_ARRAY,
    page: Joi.number().integer().min(1),
    pageSize: Joi.number().integer().min(0),
    sort: Joi.string(),
    search: Joi.string(),
    searchField: JOI_STRING_OR_STRING_ARRAY,
    // Remove query as it may be a security issue if published
    query: Joi.object().forbidden(),
  }),
  get: Joi.object({
    id: JOI_ID.required(),
    populate: JOI_STRING_OR_STRING_ARRAY,
    fields: JOI_STRING_OR_STRING_ARRAY,
    mapping: Joi.bool(),
  }),
};

module.exports = {
  actionValidators,
};
