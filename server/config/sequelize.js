module.exports = {
  /**
   * This file contains all the configuration for sequelize.
   *
   * @see http://docs.sequelizejs.com/manual/installation/usage.html
   */

  development: {
    host: 'localhost',
    username: 'root',
    password: process.env.DB_PWD || '',
    database: process.env.DB_DATABASE || 'kapp',
    dialect: 'mysql',

    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
    operatorsAliases: false,
  },

  production: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT || 'mysql',

    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorsAliases: false,
    benchmark: true,
  },

  test: {
    host: 'localhost',
    username: 'root',
    database: 'test-db',
    dialect: 'sqlite',
    storage: ':memory:',
    operatorsAliases: false,
  },
};
