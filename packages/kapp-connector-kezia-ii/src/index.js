const Runner = require('./runner');
const events = require('./events');

class KeziaIIConnector {
  constructor(options) {
    this.options = {
      ...options,
    };
  }

  init() {
    const missingEnv = [
      'ODBC_CN',
      'ERROR_EMAIL',
      'SENDGRID_API_KEY',
      'K_APP_URL',
      'K_APP_USERNAME',
      'K_APP_PASSWORD',
    ].filter(envName => !process.env[envName]).join(',');

    if (missingEnv) {
      console.error(`Following environment variables are missing: ${missingEnv}`);
      process.exit(1);
      return;
    }

    const tasks = [];

    tasks.push({
      name: 'events',
      handler: events.run,
    });

    this.runner = new Runner({
      ...this.options.runner,
      tasks,
    });
  }

  start() {
    this.runner.startAll();
  }

  stop() {
    this.runner.stopAll();
  }
}

module.exports = {
  KeziaIIConnector,
};
