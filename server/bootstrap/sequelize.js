const Sequelize = require('sequelize');
const logger = require('../logger');
const DB_SEQUELIZE = require('../config/sequelize');
const models = require('../app/models');

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
  const CONF = DB_SEQUELIZE[process.env.NODE_ENV];

  logger.debug('Booting sequelize with:', {
    ...CONF,
    password: undefined,
  });

  // Set logging function
  CONF.logging = query => logger.verbose(`[Sequelize] ${query}`);

  if (_sequelize) {
    logger.warn('Sequelize was already running! Creating a new instance...');
    await _sequelize.close();
  }

  _sequelize = new Sequelize(CONF);

  initModel();

  await _sequelize.sync();

  logger.debug('Database is synchronised with sequelize');
}

module.exports = {
  start,
  /**
   * Return a sequelize instance.
   * @return {Sequelize}
   */
  get sequelize() {
    return _sequelize;
  },
};
