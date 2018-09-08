// eslint-disable-next-line camelcase
const child_exec = require('child_process');
const util = require('util');
const { checkEnv } = require('../utils');

const exec = util.promisify(child_exec.exec);

async function run() {
  checkEnv(
    'DB__HOST',
    'DB__USERNAME',
    'DB__PASSWORD',
    'DB__DATABASE',
  );

  console.log('[update] Install dependencies');
  await exec('yarn run install:prod');
  console.log('[update] Dependencies installed');


  console.log('[update] Build front');
  // TODO Add front env variables when Angular handle it
  await exec('yarn run build', { env: {} });
  console.log('[update] Front build completed');

  console.log('[update] Migrate database');
  await exec('yarn run cli migrate', { env: process.env });
  console.log('[update] Database migrated');

  try {
    console.log('[update] Restarting services');
    // TODO Staging switch with env variable
    await exec('sudo systemctl restart kapp@*');
    console.log('[update] Services restarted');
  } catch (e) {
    console.error('[update] Unable to restart services! You must add this command with sudo');
    console.error('[update] You MUST restart services with `sudo systemctl restart kapp@*`!');
  }
}

module.exports = {
  run,
};
