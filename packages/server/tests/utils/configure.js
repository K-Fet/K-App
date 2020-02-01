const { start } = require('../../bootstrap/config');

process.env.WEB__JWT_SECRET = 'Something';
// Pass jest-mongodb url to our config
process.env.MONGODB__URL = process.env.MONGO_URL;

start();
