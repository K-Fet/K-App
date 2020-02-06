const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
  name: 'FindEntity',

  // Wrap local action handlers
  localAction(handler, action) {
    if (!action.needEntity) return handler;

    return async function FindEntityMiddleware(ctx) {
      const svc = ctx.service;
      const entity = await svc.getById(ctx.params.id, true);
      if (!entity) {
        throw new MoleculerClientError('Entity not found!', 404, 'ERR_ENTITY_NOT_FOUND');
      }

      ctx.locals.entity = entity;

      // Call the handler
      return handler(ctx);
    };
  },
};
