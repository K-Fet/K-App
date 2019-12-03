const path = require('path');
const Umzug = require('umzug');
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const { checkEnv, getSequelizeInstance } = require('../utils');


/**
 * Return an instance of umzug ready to be used.
 *
 * @param sequelize {Sequelize} ready to use sequelize instance.
 * @param mongooseInstance {Mongoose} Mongoose instance
 * @return {Promise<Umzug|*>} Umzug instance
 */
async function getUmzugInstance(sequelize, mongooseInstance) {
  return new Umzug({
    storage: 'mongodb',
    storageOptions: {
      connection: mongooseInstance,
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize, mongooseInstance],
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

  const mongooseInstance = await mongoose.connect(process.env.MONGODB__URL);

  const umzug = await getUmzugInstance(sequelize, mongooseInstance);

  const migrations = (process.argv[3] && process.argv[3] === 'down')
    ? await umzug.down() // Revert the last executed migration
    : await umzug.up(); // Execute all pending / not yet executed migrations

  console.log(`[migrate] Migration done, applied ${migrations.length} update scripts:`);

  migrations.forEach(({ file }) => console.log(`[migrate]    - ${file}`));
}

module.exports = {
  run,
};
