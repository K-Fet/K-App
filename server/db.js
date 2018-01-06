const Sequelize = require('sequelize');
const logger = require('./logger');
const DB_CONFIG = require('./config/db');
const models = require('./app/models/index');

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


/*========================
    Model initialization
==========================*/

logger.debug('Loading models into sequelize');

// Call init for all models

for (const m of Object.values(models)) m.init(sequelize);

logger.debug('Models initialized ! Loading associations now...');

// Load model associations
for (const m of Object.values(models)) {
    if (typeof m.associate === 'function') {
        m.associate(models);
    }
}

const modelNameList = Object.values(models).map(m => m.name).join(', ');

logger.debug('Models loaded: %s', modelNameList);


/*========================
    Populate database
==========================*/


if (process.env.NODE_ENV !== 'test') {
    logger.debug('Synchronising the database...');

    sequelize.sync().then(() => {
        logger.debug('Database is synchronised with sequelize');
    });
} else {
    logger.debug('[TEST] Skip synchronisation');
}


module.exports = sequelize;
