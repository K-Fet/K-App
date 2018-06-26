const logger = require('./logger');
const { boot } = require('./bootstrap');

boot().then(() => {
  logger.info('Application has booted');
});
