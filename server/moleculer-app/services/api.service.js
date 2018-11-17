const ApiGateway = require('moleculer-web');

module.exports = {
  name: 'api',
  mixins: [ApiGateway],

  settings: {
    middleware: true,
  },
};
