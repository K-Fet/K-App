const logger = require('./logger');
const { boot } = require('./bootstrap');

boot().then(() => {
  logger.info('Application has booted');
}).catch((err) => {
  logger.error('Error while loading app, stopping the server: %o', err);
  process.exit(1);
});
