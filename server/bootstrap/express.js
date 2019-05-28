const http = require('http');
const express = require('express');
const conf = require('nconf');
const compression = require('compression');
const logger = require('../logger');
const moleculerApp = require('../moleculer-app');

let _app = null;

function setProductionEnv() {
  _app.use(compression());
  _app.disable('x-powered-by');

  // Prevent click jacking
  _app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    return next();
  });

  if (!conf.get('web:trustedProxy') && !process.env.UNSAFE_MODE) {
    logger.error('You should not launch this application in production without a secure proxy.');
    logger.error('\tThis app should use a proxy server like Apache, Caddy or Nginx to add a TLS layer');
    logger.error('\tand to serve static files quickly.');
    logger.error('\tYou must configure the `TRUSTED_PROXY` env variable to launch this server in production');
    logger.error('\tFor safety measure, application will turn itself off!');
    logger.error('\tIf you really don\'t want to do so, use the `UNSAFE_MODE` env variable');
    process.exit(1);
  }

  if (!process.env.UNSAFE_MODE) {
    // Configure proxy
    _app.set('trust proxy', conf.get('web:trustedProxy'));
    return;
  }
  logger.warn('You are in UNSAFE mode, consider stopping using this mode!');
}

function launch() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(_app);
    const port = conf.get('web:port');

    server.on('error', (error) => {
      if (error.syscall !== 'listen') return reject(error);

      const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

      // Handle specific listen errors with friendly messages.
      switch (error.code) {
        case 'EACCES':
          logger.error(`Web app :${bind} requires elevated privileges`);
          break;
        case 'EADDRINUSE':
          logger.error(`Web app :${bind} is already in use`);
          break;
        default:
          return reject(error);
      }
      return reject(new Error('Error while launching HTTP server'));
    });

    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      logger.info(`Listening on ${bind}`);
      return resolve();
    });

    // Listen on provided port, on provided interface or all of them.
    server.listen(port, conf.get('web:hostname'));
  });
}

async function start({ skipHttpServer = false }) {
  _app = express();

  // Prod middleware
  if (process.env.NODE_ENV === 'production') {
    setProductionEnv();
  }

  // Serve the API first
  // Lazy load routes because config is loaded in bootstrap
  // and routes are loaded before bootstrap (with global require)
  // eslint-disable-next-line global-require
  _app.use(`${conf.get('web:prefix')}/v1/`, require('../app/routes'));

  await moleculerApp.start({ expressApp: _app, apiPath: `${conf.get('web:prefix')}/v2` });

  // Then try to send existing files
  _app.use(express.static(conf.get('web:publicFolder')));

  // Otherwise send index.html
  _app.get('*', (req, res) => res.sendFile(`${conf.get('web:publicFolder')}/index.html`));

  if (!skipHttpServer) await launch();
}


module.exports = {
  start,
  get app() {
    return _app;
  },
};
