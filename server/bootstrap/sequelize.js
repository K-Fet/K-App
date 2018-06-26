const Sequelize = require('sequelize');
const logger = require('../logger');
const DB_SEQUELIZE = require('../config/sequelize');
const models = require('../app/models');

const CONF = DB_SEQUELIZE[process.env.NODE_ENV];

let _sequelize = null;

function initModel() {
  logger.debug('Loading models into sequelize');

  // Call init for all models

  Object.values(models).forEach(m => m.init(_sequelize));

  logger.debug('Models initialized ! Loading associations now...');

  // Load model associations
  Object.values(models)
    .filter(m => typeof m.associate === 'function')
    .forEach(m => m.associate(models));

  const modelNameList = Object.values(models)
    .map(m => m.name)
    .join(', ');

  logger.debug('Models loaded: %s', modelNameList);
}

async function start() {
  logger.debug('Synchronising the database...');

  _sequelize = new Sequelize(CONF);

  initModel();

  await _sequelize.sync();

  logger.debug('Database is synchronised with sequelize');
}

module.exports = {
  start,
  get sequelize() {
    return _sequelize;
  },
};
