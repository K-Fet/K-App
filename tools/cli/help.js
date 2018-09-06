/**
 * Log to stdout the usage of the cli.
 *
 * @param actions {Array<{key: string, description: string, noGui: boolean}>} Actions
 */
function showHelp(actions) {
  console.log('[cli] Usage:');
  console.log('[cli]    npm run cli <action>');
  console.log('[cli]');
  console.log('[cli] Where <action> can be:');

  const noGuiStr = ' (no-gui)';

  // Find max str size
  const size = actions.reduce((maxSize, { noGui, key }) => {
    const sum = key.length + (noGui ? noGuiStr.length : 0);
    return sum > maxSize ? sum : maxSize;
  }, 0);

  actions.forEach(({ key, description, noGui }) => {
    const title = key + (noGui ? noGuiStr : '');
    console.log(`[cli]    ${title.padEnd(size)}: ${description}`);
  });
}

async function run({ actions }) {
  const action = process.argv[3];

  if (!action) {
    showHelp(actions);
    return;
  }

  const foundAction = actions.find(a => a.key === action);

  if (!foundAction) {
    console.log(`[cli] Action '${foundAction}' was not found`);
    return;
  }

  if (!foundAction.help) {
    console.log(`[cli] Did not find help for the action '${action}'`);
    return;
  }
  console.log(`[cli] Help for action '${action}':`);
  console.log(`[cli]  ${foundAction.help}`);
}

module.exports = {
  run,
};
