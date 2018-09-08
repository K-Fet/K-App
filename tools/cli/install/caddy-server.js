const child_process = require('child_process');
const util = require('util');
const { createDirDeep } = require('../utils');

const exec = util.promisify(child_process.exec);

const CADDY_SSL_PATH = '/etc/ssl/caddy';

async function installCaddy() {
  console.log('[install] Installing Caddy Server');
  const caddyPlugins = [
    'http.cache',
    'http.git',
  ];
  const { stderr } = await exec(`curl https://getcaddy.com --fail --silent --show-error | bash -s personal ${caddyPlugins.join(',')}`);
  if (stderr) {
    console.error('[install] Error while installing caddy', stderr);
    throw new Error('Error while installing caddy');
  }

  try {
    // Create www-data user (don't care about the output)
    await exec('groupadd -g 33 www-data');
    await exec('useradd g www-data --no-user-group --home-dir /var/www'
      + ' --no-create-home --shell /usr/sbin/nologin --system --uid 33 www-data');
  } catch (e) {
    console.info('[install] Skip www-data creation');
  }

  // Create ssl dir path
  await createDirDeep(CADDY_SSL_PATH);
  await exec(`chown -R root:www-data ${CADDY_SSL_PATH}`);
  await exec(`chmod 0770 ${CADDY_SSL_PATH}`);

  console.log('[install] Caddy server installed!');
}

module.exports = {
  installCaddy,
};
