const { checkEnv, exec } = require('../utils');

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
  //  We need to do it because dotenv add process variables but it will not
  //  be sent with child_process.
  await exec('yarn run build');
  console.log('[update] Front build completed');

  console.log('[update] Migrate database');
  await exec('yarn run cli migrate', { env: process.env });
  console.log('[update] Database migrated');

  try {
    console.log('[update] Restarting services');
    await exec(`sudo systemctl restart ${process.env.DB__DATABASE}@*`);
    console.log('[update] Services restarted');
  } catch (e) {
    console.error(`[update] Unable to restart services! (got exit code ${e.code}) You must add this command with sudo`);
    console.error(`[update]   stdout: ${e.stdout}`);
    console.error(`[update]   stderr: ${e.stderr}`);
    console.error(`[update] You MUST restart services with \`sudo systemctl restart ${process.env.DB__DATABASE}@*\`!`);
  }
}

module.exports = {
  run,
};
