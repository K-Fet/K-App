const { MoleculerError } = require('moleculer').Errors;
const ApiGateway = require('moleculer-web');

module.exports = {
  name: 'api',
  mixins: [ApiGateway],

  settings: {
    middleware: true,

    routes: [{
      // Allow only declared routes
      mappingPolicy: 'all',

      // See https://moleculer.services/docs/0.13/moleculer-web.html#Disable-merging
      mergeParams: false,

      // List all routes
      aliases: {
        'GET stock-events': 'stock-events.list',
        'GET stock-events/:id': 'stock-events.get',
        'POST stock-events': 'stock-events.create',
      },
    }],

    onError(req, res, err) {
      if (res.headersSent) {
        this.logger.warn('Headers have already sent');
        return;
      }

      if (!err || !(err instanceof Error)) {
        res.writeHead(500);
        res.end('Internal Server Error');

        this.logResponse(req, res);
        return;
      }

      if (!(err instanceof MoleculerError)) {
        const e = err;
        // eslint-disable-next-line no-param-reassign
        err = new MoleculerError(e.message, e.code || e.status, e.type, e.data);
        // eslint-disable-next-line no-param-reassign
        err.name = e.name;
      }

      // Return with the error as JSON object
      res.setHeader('Content-type', 'application/json; charset=utf-8');

      const code = +err.code || 500;
      res.writeHead(code);

      const errObj = ['name', 'message', 'code', 'type', 'data'].reduce((acc, key) => {
        acc[key] = err[key];
        return acc;
      }, {});
      res.end(JSON.stringify(errObj, null, 2));

      this.logResponse(req, res);
    },
  },
};
