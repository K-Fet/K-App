const winston = require('winston');
const { format } = winston;

const LOGGER_CONFIG = require('./config/logger');

const logger = winston.createLogger({
    level: LOGGER_CONFIG.level,
    transports: [
        new winston.transports.Console()
    ],
    format: format.combine(
        format.colorize({ all: true }),
        format.splat(),
        winston.format.simple()
    )
});

module.exports = logger;
