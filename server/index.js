const http = require('http');
const express = require('express');
const compression = require('compression');
const logger = require('./logger');
const routes = require('./app/routes');
const WEB_CONFIG = require('./config/web');
const { boot } = require('./bootstrap');

const app = express();
const server = http.createServer(app);

// Database init
require('./db');

boot().then(() => {
  logger.info('Application has booted');
});


// Prod middleware
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.disable('x-powered-by');

  // Prevent click jacking
  app.use((req, res, next) => {
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

// Configure proxy
app.set('trust proxy', WEB_CONFIG.trustedProxy);

// Serve the API first
app.use('/api/', routes);

// Then try to send existing files
app.use(express.static(WEB_CONFIG.publicFolder));

// Otherwise send index.html
app.get('*', (req, res) => res.sendFile(`${WEB_CONFIG.publicFolder}/index.html`));


//
// Launching server
//

/**
 * Function called when an error is thrown by the http server
 * It can stop the entire process
 * @param error
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof WEB_CONFIG.port === 'string' ? `Pipe ${WEB_CONFIG.port}` : `Port ${WEB_CONFIG.port}`;

  // Handle specific listen errors with friendly messages.
  switch (error.code) {
    case 'EACCES':
      logger.error(`Web app :${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`Web app :${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}


server.on('error', onError);
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
});

// Listen on provided port, on provided interface or all of them.
server.listen(WEB_CONFIG.port, WEB_CONFIG.hostname);
