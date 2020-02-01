const nconf = require('nconf');

const IS_TESTING = process.env.NODE_ENV === 'test';

function start() {
  nconf
    .env({
      parseValues: true,
      separator: '__',
      transform({ key, value }) {
        const newKey = key
          .split('__')
          // SNAKE_CASE to camelCase
          .map(w => w.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase()))
          .join('__');
        return {
          key: newKey,
          value,
        };
      },
    })
    .defaults({
      db: {
        dialect: 'mysql',
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
      mail: {
        port: 587,
      },
      web: {
        port: 3000,
        prefix: '/api',
      },
      feed: {},
      misc: {},
      logger: {
        /**
         * Level of logging.
         * @see https://github.com/winstonjs/winston#logging-levels
         */
        level: 'silly',
      },
    })
    .required(IS_TESTING ? [] : [
      // Database
      'db:host',
      'db:username',
      'db:database',
      'db:password',

      'mongodb:url',

      // Mail
      'mail:host',
      'mail:auth:user',
      'mail:auth:pass',
      'mail:contact:concert',
      'mail:contact:event',
      'mail:contact:lost',
      'mail:contact:website',

      // Web
      'web:clientUrl',
      'web:apiUrl',
      'web:jwtSecret',
      'web:recaptchaSecret',
    ]);
}

module.exports = {
  start,
};
