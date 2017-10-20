const winston = require('winston');
const express = require('express');
const fs = require('fs');

const routes = require('./routes');
const app = express();

const WEB_CONFIG = require('./config/web');


app.use('/', routes);


//
// Launching server
//

if (WEB_CONFIG.ssl && (!WEB_CONFIG.ssl.cert || !WEB_CONFIG.ssl.key)) {
    throw new Error("Cannot start HTTPS server, `sslKey` or `sslCert` is missing in config.js.");
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

// Marc antoine travaille !

// Listen on provided port, on all network interfaces.
server.listen(WEB_CONFIG.port);
server.on('error', onError);
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});


/**
 * Function called when an error is thrown by the http server
 * It can stop the entire process
 * @param error
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // Handle specific listen errors with friendly messages.
    switch (error.code) {
        case 'EACCES':
            console.error(`Web app :${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Web app :${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
