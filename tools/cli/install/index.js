const { installCaddy } = require('./caddy-server');
const { systemd } = require('./systemd');

async function run() {
  await installCaddy();
}

module.exports = {
  run,
};
