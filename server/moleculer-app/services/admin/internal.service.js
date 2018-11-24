module.exports = {
  name: 'admin.internal',

  actions: {
    list: {
      permissions: ['internal:list'],
      handler(ctx) {
        return ctx.call('$node.list');
      },
    },

    services: {
      permissions: ['internal:services'],
      handler(ctx) {
        return ctx.call('$node.services');
      },
    },

    actions: {
      permissions: ['internal:actions'],
      handler(ctx) {
        return ctx.call('$node.actions');
      },
    },

    events: {
      permissions: ['internal:events'],
      handler(ctx) {
        return ctx.call('$node.events');
      },
    },

    health: {
      permissions: ['internal:health'],
      handler(ctx) {
        return ctx.call('$node.health');
      },
    },

    options: {
      permissions: ['internal:options'],
      handler(ctx) {
        return ctx.call('$node.options');
      },
    },
  },
};
