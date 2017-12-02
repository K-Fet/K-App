const Sequelize = require('sequelize');
const DB_CONFIG = require('./config/db');

const sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.user, DB_CONFIG.password, {
    host: DB_CONFIG.host,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

module.exports = sequelize;
