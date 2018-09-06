#!/usr/bin/env node
const backup = require('./backup');
const createAdminAccount = require('./create-admin-account');
const install = require('./install');
const migrate = require('./migrate');
const populate = require('./populate');
const release = require('./release');
const update = require('./update');

if (require.main !== module) {
  console.log('[cli] This script should always be launched alone!');
  process.exit(1);
}

function showHelp() {
  console.log('[cli] Usage:');
  console.log('[cli]    npm run cli <action>');
  console.log('[cli]');
  console.log('[cli] Where <action> can be:');
  console.log('[cli]    backup (no-gui)     : Save all the database into the `backup` folder');
  console.log('[cli]    create-admin-account: Create an admin account if needed');
  console.log('[cli]    install             : Setup/Repair wizard');
  console.log('[cli]    migrate (no-gui)    : Migrate the current database to the new version');
  console.log('[cli]    populate            : Populate the database with some generated data');
  console.log('[cli]    release             : Launch a new release');
  console.log('[cli]    update (no-gui)     : Handle new update changes');
}

/**
 * Main entry for the cli.
 *
 * @param action {'backup','create-admin-account','install','migrate','populate','release','update', 'help'} Action
 * @returns {Promise<void>}
 */
async function main(action) {
  if (!action) {
    console.error('[cli] Missing required argument `action`');
    showHelp();
    return;
  }

  switch (action) {
    case 'backup':
      await backup.run();
      break;
    case 'create-admin-account':
      await createAdminAccount.run();
      break;
    case 'help':
      showHelp();
      break;
    case 'install':
      await install.run();
      break;
    case 'migrate':
      await migrate.run();
      break;
    case 'populate':
      await populate.run();
      break;
    case 'release':
      await release.run();
      break;
    case 'update':
      await update.run();
      break;
    default:
      console.error(`[cli] Unrecognised action '${action}'`);
      showHelp();
      break;
  }
}

main(process.argv[2]).catch((e) => {
  console.error('[cli] An error happened: ', e);
  process.exit(1);
});
