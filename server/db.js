const Sequelize = require('sequelize');
const logger = require('./logger');
const DB_SEQUELIZE = require('./config/sequelize');
const models = require('./app/models/index');
const { syncPermissions } = require('./permissions-init');

const CONF = DB_SEQUELIZE[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(CONF);

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

const modelNameList = Object.values(models)
    .map(m => m.name)
    .join(', ');

logger.debug('Models loaded: %s', modelNameList);


/*========================
    Populate database
==========================*/


logger.debug('Synchronising the database...');

sequelize._syncPromise = sequelize
    .sync()
    .then(() => {
        logger.debug('Database is synchronised with sequelize, synchronising permissions');
        return syncPermissions();
    })
    .then(() => {
        logger.debug('Permissions are synchronised with database');
    })
    .catch(err => {
        logger.error('Error while synchronising sequelize and permissions:', err);
        logger.error('Exiting for safety');
        process.exit(1);
    });


module.exports = sequelize;
