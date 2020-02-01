const { start } = require('../../bootstrap/config');

process.env.WEB__JWT_SECRET = 'Something';

start();
