const path = require('path');
const Umzug = require('umzug');
const Sequelize = require('sequelize');
const { ServiceBroker } = require('moleculer');
const { checkEnv, getSequelizeInstance } = require('../utils');


/**
 * Return an instance of umzug ready to be used.
 *
 * @param sequelize {Sequelize} ready to use sequelize instance.
 * @param broker moleculer broker instance (with all services launched).
 * @return {Promise<Umzug|*>} Umzug instance
 */
async function getUmzugInstance(sequelize, broker) {
  return new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize, broker],
      path: path.join(__dirname, 'scripts'),
      pattern: /^\d+-[\w-]+\.js$/,
    },
  });
}

async function run() {
  checkEnv(
    'DB__HOST',
    'DB__USERNAME',
    'DB__PASSWORD',
    'DB__DATABASE',
    'MONGODB__URL',
  );
  console.log('[migrate] Migration started');

  const sequelize = await getSequelizeInstance();

  const broker = new ServiceBroker();
  broker.loadServices(path.join(__dirname, '../../../server/moleculer-app/services'));
  await broker.start();

  const umzug = await getUmzugInstance(sequelize, broker);

  const migrations = (process.argv[3] && process.argv[3] === 'down')
    ? await umzug.down() // Revert the last executed migration
    : await umzug.up(); // Execute all pending / not yet executed migrations

  console.log(`[migrate] Migration done, applied ${migrations.length} update scripts:`);

  migrations.forEach(({ file }) => console.log(`[migrate]    - ${file}`));
}

module.exports = {
  run,
};
