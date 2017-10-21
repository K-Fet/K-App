const winston = require('winston');
const { transports, format } = winston;

winston.configure({
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.simple()
    ),
    transports: [new transports.Console()]
});



