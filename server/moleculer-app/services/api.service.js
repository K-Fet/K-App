const { MoleculerError } = require('moleculer').Errors;
const ApiGateway = require('moleculer-web');
const jwt = require('jsonwebtoken');
const xhub = require('express-x-hub');
const conf = require('nconf');
const util = require('util');
const authService = require('../../app/services/auth-service');

const { UnAuthorizedError, ERR_INVALID_TOKEN, ERR_NO_TOKEN } = ApiGateway.Errors;
const jwtVerify = util.promisify(jwt.verify);

module.exports = {
  name: 'api',
  mixins: [ApiGateway],

  settings: {
    middleware: true,

    use: [
      xhub({
        algorithm: 'sha1',
        secret: conf.get('feed:accessToken'),
      }),
    ],

    routes: [
      {
        path: '/admin',

        authorization: true,

        // Allow only declared routes
        mappingPolicy: 'restrict',

        // List all routes
        aliases: {
          'GET list': 'admin.internal.list',
          'GET services': 'admin.internal.services',
          'GET actions': 'admin.internal.actions',
          'GET events': 'admin.internal.events',
          'GET health': 'admin.internal.health',
          'GET options': 'admin.internal.options',
        },
      },
      {
        path: '/inventory-management',

        authorization: true,

        // Allow only declared routes
        mappingPolicy: 'restrict',

        // See moleculerjs/moleculer#419
        // See https://moleculer.services/docs/0.13/moleculer-web.html#Disable-merging
        // mergeParams: false,

        bodyParsers: { json: true },

        // List all routes
        aliases: {
          'GET stock-events': 'inventory-management.stock-events.list',
          'GET stock-events/:id': 'inventory-management.stock-events.get',
          'POST stock-events': 'inventory-management.stock-events.add',

          'GET providers/find': 'inventory-management.providers.find',
          'GET providers/count': 'inventory-management.providers.count',
          'REST providers': 'inventory-management.providers',

          'GET products/find': 'inventory-management.products.find',
          'GET products/count': 'inventory-management.products.count',
          'REST products': 'inventory-management.products',
        },
      },
    ],

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

  methods: {
    async authorize(ctx, route, req) {
      // Read the token from header
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer')) throw new UnAuthorizedError(ERR_NO_TOKEN);

      // Decode JWT
      const token = auth.slice(7);
      let decoded = null;
      try {
        decoded = await jwtVerify(token, conf.get('web:jwtSecret'));
      } catch (e) {
        throw new UnAuthorizedError(ERR_INVALID_TOKEN);
      }

      // Check token
      // TODO: Use moleculer service insteadof old app
      const revoked = await authService.isTokenRevoked(decoded.jit);
      if (revoked) throw new UnAuthorizedError(ERR_INVALID_TOKEN);

      // Populate ctx.meta.user
      ctx.meta.user = await authService.me(decoded.jit);
    },
  },
};
