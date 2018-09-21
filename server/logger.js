const { createLogger, format, transports: { Console } } = require('winston');

const fixErrorProperties = (o) => {
  if (o instanceof Error) {
    Object.defineProperty(o, 'message', { enumerable: true });
  }
  return o;
};

/**
 * Create a format instance for winston.
 * It just stringify the message with the timestamp
 */
const stringify = format((info) => {
  const {
    timestamp, level, message, meta,
  } = info;
  let str = JSON.stringify(fixErrorProperties(meta), null, 4) || '';

  if (str === '{}') str = '';

  if (str) {
    const padding = '\n    ';
    str = `${padding}${str.split('\n').join(padding)}`;
  }

  return {
    ...info,
    [Symbol.for('message')]: `[${timestamp}] ${level}: ${message} ${str}`,
  };
});

const logger = createLogger({
  level: process.env.LOGGER__LEVEL || 'silly',
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
