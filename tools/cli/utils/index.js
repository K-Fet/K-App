const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

/**
 * Check if every variables passed in the function is set.
 *
 * @param variables
 */
function checkEnv(...variables) {
  variables.forEach((t) => {
    if (!process.env[t]) throw new Error(`Empty or missing env property '${t}'! Check your .env file`);
  });
}


/**
 * Ask the user for database information and load an sequelize with it.
 *
 * @return {Promise<Sequelize>} Sequelize instance
 */
async function getSequelizeInstance() {
  const {
    DB__HOST, DB__USERNAME, DB__PASSWORD, DB__DATABASE,
  } = process.env;

  const sequelize = new Sequelize({
    host: DB__HOST,
    username: DB__USERNAME,
    password: DB__PASSWORD,
    database: DB__DATABASE,
    dialect: 'mysql',
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  });

  try {
    await sequelize.authenticate();
  } catch (e) {
    throw new Error('Unable to authenticate in sequelize, please check your credentials');
  }

  return sequelize;
}

/**
 * Create all directories needed.
 *
 * @param pathToCreate
 */
function createDirDeep(pathToCreate) {
  pathToCreate.split(path.sep).reduce((currentPath, folder) => {
    currentPath += folder + path.sep;
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
    return currentPath;
  }, '');
}


module.exports = {
  checkEnv,
  createDirDeep,
  getSequelizeInstance,
};
