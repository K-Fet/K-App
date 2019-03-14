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
    server: false,

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
        path: '/core',
        whitelist: ['v1.core.**'],
        authorization: true,
        autoAliases: true,
        bodyParsers: { json: true },
      },
      {
        path: '/inventory-management',
        whitelist: ['inventory-management.**'],
        authorization: true,
        autoAliases: true,
        bodyParsers: { json: true },
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

      let code = +err.code || 500;

      if (code < 100 || code > 599) {
        this.logger.error(`Unknown HTTP STATUS CODE ${code}! Sending 500 instead`);
        code = 500;
      }

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
