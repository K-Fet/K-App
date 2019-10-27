const { MoleculerError } = require('moleculer').Errors;
const ApiGateway = require('moleculer-web');
const jwt = require('jsonwebtoken');
const xhub = require('express-x-hub');
const conf = require('nconf');
const util = require('util');

const { UnAuthorizedError, ERR_INVALID_TOKEN, ERR_NO_TOKEN } = ApiGateway.Errors;
const jwtVerify = util.promisify(jwt.verify);

/**
 * Service & Action level authorization field.
 * You must disable `authorization` at route level!
 */
async function onBeforeCallAuthorize(ctx, route, req) {
  const serviceAuthorization = req.$service.settings.authorization;
  const actionAuthorization = req.$action.authorization;

  if ((serviceAuthorization && !(actionAuthorization === false)) || actionAuthorization) {
    ctx.meta.user = await this.authenticate(ctx, route, req);
    await this.authorize(ctx);
  }
}

const DEFAULT_ROUTE_OPTS = {
  authentication: true,
  authorization: true,
  autoAliases: true,
  bodyParsers: { json: true },
};

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
        ...DEFAULT_ROUTE_OPTS,
        path: '/admin',
        // Allow only declared routes
        autoAliases: false,
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
        ...DEFAULT_ROUTE_OPTS,
        authorization: false,
        path: '/acl',
        whitelist: ['v1.acl.**'],
        onBeforeCall: onBeforeCallAuthorize,
      },
      {
        ...DEFAULT_ROUTE_OPTS,
        path: '/core',
        whitelist: ['v1.core.**'],
      },
      {
        ...DEFAULT_ROUTE_OPTS,
        path: '/inventory-management',
        whitelist: ['inventory-management.**'],
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
        this.logger.error(`Unknown HTTP STATUS CODE ${code}! Sending 500 instead: %o`, err);
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
    async authenticate(ctx, route, req) {
      if (ctx.meta.user) return ctx.meta.user;

      // Read the token from header
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer')) {
        ctx.meta.authenticationError = ERR_NO_TOKEN;
        return null;
      }

      // Decode JWT
      const token = auth.slice(7);
      let decoded = null;
      try {
        decoded = await jwtVerify(token, conf.get('web:jwtSecret'));
      } catch (e) {
        ctx.meta.authenticationError = ERR_INVALID_TOKEN;
        return null;
      }

      // Check token
      try {
        const { userId, _id } = await ctx.call('v1.acl.jwt.get', { id: decoded.jit });

        ctx.meta.jit = _id;
        return await ctx.call('v1.acl.users.get', { id: userId });
      } catch (e) {
        ctx.meta.authenticationError = ERR_INVALID_TOKEN;
        return null;
      }
    },

    async authorize(ctx) {
      if (!ctx.meta.user) throw new UnAuthorizedError(ctx.meta.authenticationError);
    },
  },
};
