const logger = require('../logger');

function start() {
  // Set global environment

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  switch (process.env.NODE_ENV) {
    case 'development':
      break;
    case 'production':
      break;
    default:
      break;
  }

  logger.info(`Server is in ${process.env.NODE_ENV}.`);
}

module.exports = {
  start,
};
