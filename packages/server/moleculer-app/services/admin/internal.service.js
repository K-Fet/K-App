module.exports = {
  name: 'admin.internal',

  actions: {
    list: {
      permissions: true,
      handler(ctx) {
        return ctx.call('$node.list');
      },
    },

    services: {
      permissions: true,
      handler(ctx) {
        return ctx.call('$node.services');
      },
    },

    actions: {
      permissions: true,
      handler(ctx) {
        return ctx.call('$node.actions');
      },
    },

    events: {
      permissions: true,
      handler(ctx) {
        return ctx.call('$node.events');
      },
    },

    health: {
      permissions: true,
      handler(ctx) {
        return ctx.call('$node.health');
      },
    },

    options: {
      permissions: true,
      handler(ctx) {
        return ctx.call('$node.options');
      },
    },
  },
};
