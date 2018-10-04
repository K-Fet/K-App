#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const actions = [
  {
    key: 'backup',
    description: 'Save all the database into the `backup` folder',
    noGui: true,
  },
  {
    key: 'create-admin-account',
    description: 'Create an admin account if needed',
    noGui: false,
  },
  {
    key: 'help',
    description: 'Show this help',
    noGui: false,
  },
  {
    key: 'install',
    description: 'Setup/Repair wizard',
    noGui: false,
  },
  {
    key: 'migrate',
    description: 'Migrate the current database to the new version',
    noGui: true,
  },
  {
    key: 'populate',
    description: 'Populate the database with some generated data',
    noGui: false,
  },
  {
    key: 'update',
    description: 'Handle new update changes',
    noGui: true,
  },
];

if (require.main !== module) {
  console.log('[cli] This script should always be launched alone!');
  process.exit(1);
}

/**
 * Main entry for the cli.
 *
 * @param action {'backup','create-admin-account','install','migrate','populate','release','update', 'help'} Action
 * @returns {Promise<void>}
 */
async function main(action) {
  let finalAction = action;
  if (!action) {
    console.error('[cli] Missing required argument `action`');
    finalAction = 'help';
  }

  const found = actions.find(value => value.key === finalAction);

  if (!found) {
    console.error(`[cli] Unrecognised action '${action}'`);
    finalAction = 'help';
  }

  // Load the right module for this action
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const actionModule = require(`./${finalAction}`);

  // Run the action with some data
  await actionModule.run({ actions });
}

main(process.argv[2])
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[cli] An error happened: ', e);
    process.exit(1);
  });
