const dotenv = require('dotenv');
const logger = require('./logger');
const { boot } = require('./bootstrap');

logger.info('Loading environment variables (dotenv)');
dotenv.config();

boot().then(() => {
  logger.info('Application has booted');
}).catch((err) => {
  logger.error('Error while loading app, stopping the server!', err);
  logger.error('Stack trace: \n%s', err.stack);
  process.exit(1);
});
