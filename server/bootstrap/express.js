const http = require('http');
const express = require('express');
const compression = require('compression');
const logger = require('../logger');
const routes = require('../app/routes');
const WEB_CONFIG = require('../config/web');

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

  if (!WEB_CONFIG.trustedProxy) {
    logger.error('You should not launch this application in production without a secure proxy.');
    logger.error('\tThis app should use a proxy server like Apache, Caddy or Nginx to add a TLS layer');
    logger.error('\tand to serve static files quickly.');
    logger.error('\tYou must configure the `TRUSTED_PROXY` env variable to launch this server in production');
    logger.error('\tFor safety measure, application will turn itself off!');
    logger.error('\tIf you really don\'t want to do so, use the `UNSAFE_MODE` env variable');
    process.exit(1);
  }

  if (process.env.UNSAFE_MODE) {
    logger.warn('You are in UNSAFE mode, consider stopping using this mode!');
  }
}

function launch(server) {
  return new Promise((resolve, reject) => {
    server.on('error', (error) => {
      if (error.syscall !== 'listen') return reject(error);

      const bind = typeof WEB_CONFIG.port === 'string'
        ? `Pipe ${WEB_CONFIG.port}`
        : `Port ${WEB_CONFIG.port}`;

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
    server.listen(WEB_CONFIG.port, WEB_CONFIG.hostname);
  });
}

async function start() {
  _app = express();
  const server = http.createServer(_app);

  // Prod middleware
  if (process.env.NODE_ENV === 'production') {
    setProductionEnv();
  }

  // Configure proxy
  _app.set('trust proxy', WEB_CONFIG.trustedProxy);

  // Serve the API first
  _app.use('/api/', routes);

  // Then try to send existing files
  _app.use(express.static(WEB_CONFIG.publicFolder));

  // Otherwise send index.html
  _app.get('*', (req, res) => res.sendFile(`${WEB_CONFIG.publicFolder}/index.html`));

  await launch(server);
}


module.exports = {
  start,
  get app() {
    return _app;
  },
};
