require('dotenv').config();
const odbc = require('odbc');
const { KeziaIIConnector } = require('./src');
const kAppApi = require('./src/k-app-api');

const PULL_MINUTES_INTERVAL = +process.env.PULL_MINUTES_INTERVAL || 10;
const MAX_TASK_FAILED = +process.env.MAX_TASK_FAILED || 5;

async function main() {
  const connector = new KeziaIIConnector({
    runner: {
      interval: PULL_MINUTES_INTERVAL * 60 * 1000,
      maxTaskFailed: MAX_TASK_FAILED,
      taskFailHandler: kAppApi.sendFailNotification,
      taskFailRecover: kAppApi.sendFailRecoverNotification,
      dbPool: await odbc.pool(process.env.ODBC_CN),
    },
  });

  connector.init();

  connector.start();

  const _exitFn = () => {
    console.log('Stopping app');
    return connector.stop();
  };
  process.on('beforeExit', _exitFn);
  process.on('exit', _exitFn);
  process.on('SIGINT', _exitFn);
  process.on('SIGTERM', _exitFn);
}

main();

