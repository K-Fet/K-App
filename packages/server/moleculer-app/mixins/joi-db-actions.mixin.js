const Joi = require('@hapi/joi');
const { MoleculerClientError } = require('moleculer').Errors;
const { JOI_ID } = require('../../utils');
const { actionValidators } = require('../utils/action-validators');

module.exports = function joiDbActions(joiModel, name) {
  const findEntity = async (ctx) => {
    const entity = await ctx.service.getById(ctx.params.id);
    if (!entity) {
      throw new MoleculerClientError('Entity not found!', 404, 'ERR_ENTITY_NOT_FOUND');
    }

    ctx.locals.entity = entity.toJSON();
  };

  return {
    hooks: {
      before: {
        get: [findEntity],
        update: [findEntity],
        remove: [findEntity],
      },
    },
    actions: {
      find: {
        rest: 'GET /find',
        permissions: [
          `${name}.read`,
        ],
        params: () => actionValidators.find,
      },
      count: {
        rest: 'GET /count',
        permissions: [
          `${name}.read`,
        ],
        params: () => actionValidators.count,
      },
      list: {
        rest: 'GET /',
        permissions: [
          `${name}.read`,
        ],
        params: () => actionValidators.list,
      },
      create: {
        rest: 'POST /',
        permissions: [
          `${name}.create`,
        ],
        params: () => joiModel,
      },
      insert: {
        rest: 'POST /insert',
        permissions: [
          `${name}.create`,
        ],
        params: () => Joi.object({
          entities: Joi.array().items(joiModel),
          entity: joiModel,
        }).without('entities', 'entity'),
      },
      get: {
        rest: 'GET /:id',
        permissions: [
          `${name}.read`,
          '$owner',
        ],
        params: () => actionValidators.get,
      },
      update: {
        rest: 'PUT /:id',
        permissions: [
          `${name}.write`,
          '$owner',
        ],
        params: () => joiModel.append({
          id: JOI_ID.required(),
        }),
      },
      remove: {
        rest: 'DELETE /:id',
        permissions: [
          `${name}.delete`,
          '$owner',
        ],
        params: () => Joi.object({
          id: JOI_ID.required(),
        }),
      },
    },
  };
};
