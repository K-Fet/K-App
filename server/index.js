const winston = require('winston');
const express = require('express');
const compression = require('compression');
const fs = require('fs');
const connection  = require('express-myconnection');
const mysql = require('mysql');

const routes = require('./app/routes');
const app = express();

const WEB_CONFIG = require('./config/web');
const DB_CONFIG = require('./config/db');

// Logger init
require('./logger');

// Prod middleware
if (process.env.NODE_ENV === 'production') {
    app.use(compression());
}

//DB connection

app.use(
    connection(mysql,DB_CONFIG,'request')
);

// Serve the API first
app.use('/api/', routes);

// Then try to send existing files
app.use(express.static(WEB_CONFIG.publicFolder));

// Otherwise send index.html
app.get('*', (req, res) => res.sendFile(WEB_CONFIG.publicFolder + '/index.html'));


//
// Launching server
//

if (WEB_CONFIG.ssl && (!WEB_CONFIG.ssl.cert || !WEB_CONFIG.ssl.key)) {
    throw new Error('Cannot start HTTPS server, `ssl.key` or `ssl.cert` is missing in config.js.');
}

// Create HTTP or HTTPS server.
let server;
if (!WEB_CONFIG.ssl) {
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
    winston.info('Listening on ' + bind);
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
