const winston = require('winston');
const express = require('express');
const fs = require('fs');

const routes = require('./app/routes');
const app = express();

const WEB_CONFIG = require('./config/web');


app.use('/', routes);


//
// Launching server
//

if (WEB_CONFIG.ssl && (!WEB_CONFIG.ssl.cert || !WEB_CONFIG.ssl.key)) {
    throw new Error('Cannot start HTTPS server, `ssl.key` or `ssl.cert` is missing in config.js.');
}

// Create HTTP or HTTPS server.
let server;
if (WEB_CONFIG.ssl) {
    server = require('http').createServer(app);
} else {
    server = require('https').createServer({
        key: fs.readFileSync(WEB_CONFIG.ssl.key),
        cert: fs.readFileSync(WEB_CONFIG.ssl.cert)
    }, app);
}

server.on('error', onError);
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    winston.log('Listening on ' + bind);
});


// Listen on provided port, on all network interfaces.
server.listen(WEB_CONFIG.port);

/**
 * Function called when an error is thrown by the http server
 * It can stop the entire process
 * @param error
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof WEB_CONFIG.port === 'string' ? 'Pipe ' + WEB_CONFIG.port : 'Port ' + WEB_CONFIG.port;

    // Handle specific listen errors with friendly messages.
    switch (error.code) {
        case 'EACCES':
            winston.error(`Web app :${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            winston.error(`Web app :${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
