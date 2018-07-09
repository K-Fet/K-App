const { createLogger, format, transports: { Console } } = require('winston');
const LOGGER_CONFIG = require('./config/logger');

/**
 * Create a format instance for winston.
 * It just stringify the message with the timestamp
 */
const stringify = format((info) => {
  const { timestamp, level, message } = info;
  let str = JSON.stringify({
    ...info,
    level: undefined,
    message: undefined,
    splat: undefined,
    timestamp: undefined,
  }, null, 4);

  if (str === '{}') {
    str = '';
  } else {
    const padding = '\n    ';
    str = `${padding}${str.split('\n').join(padding)}`;
  }

  return {
    ...info,
    [Symbol.for('message')]: `[${timestamp}] ${level}: ${message} ${str}`,
  };
});

const logger = createLogger({
  level: LOGGER_CONFIG.level,
  transports: [
    new Console(),
  ],
  format: format.combine(
    format.colorize({ all: true }),
    format.splat(),
    format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }),
    stringify(),
  ),
});


logger.stream = {
  /**
   * Stream the morgan logger to winston.
   *
   * @param message
   * @param encoding
   */
  write(message, encoding) { // eslint-disable-line no-unused-vars
    logger.info(message);
  },
};

module.exports = logger;
