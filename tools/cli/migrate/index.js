const path = require('path');
const Umzug = require('umzug');
const Sequelize = require('sequelize');
const { checkEnv, getSequelizeInstance } = require('../utils');


/**
 * Return an instance of umzug ready to be used.
 *
 * @param sequelize {Sequelize} ready to use sequelize instance.
 * @return {Promise<Umzug|*>} Umzug instance
 */
async function getUmzugInstance(sequelize) {
  return new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: path.join(__dirname, 'scripts'),
      pattern: /^\d+-[\w-]+\.js$/,
    },
  });
}

async function run() {
  checkEnv(
    'DB_HOST',
    'DB_USER',
    'DB_PWD',
    'DB_DATABASE',
  );
  console.log('[migrate] Migration started');

  const sequelize = await getSequelizeInstance();
  const umzug = await getUmzugInstance(sequelize);

  const migrations = await umzug.up();

  console.log(`[migrate] Migration done, applied ${migrations.length} update scripts:`);

  migrations.forEach(({ file }) => console.log(`[migrate]    - ${file}`));
}

module.exports = {
  run,
};
