const winston = require('winston');
const { transports, format } = winston;

const LOGGER_CONFIG = require('./config/logger');

winston.configure({
    level: LOGGER_CONFIG.level,
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.simple()
    ),
    transports: [new transports.Console()]
});
