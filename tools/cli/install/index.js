const { envSetup } = require('./env');
const { installCaddy } = require('./caddy-server');
const { systemd } = require('./systemd');
const { mysqlInstall } = require('./mysql');

async function run() {
  await installCaddy();
  await mysqlInstall();
  envSetup();
  systemd();
}

module.exports = {
  run,
};
