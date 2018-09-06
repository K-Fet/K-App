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
    DB_HOST, DB_USER, DB_PWD, DB_DATABASE,
  } = process.env;

  const sequelize = new Sequelize({
    host: DB_HOST,
    username: DB_USER,
    password: DB_PWD,
    database: DB_DATABASE,
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


module.exports = {
  checkEnv,
  getSequelizeInstance,
};
