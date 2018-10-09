const path = require('path');
const fs = require('fs');

async function run() {
  const script = process.argv[3];

  if (!script) throw new Error('Missing script argument');
  if (script === 'index') throw new Error('Nop, you don\'t want to do that');
  if (!fs.existsSync(path.join(__dirname, `${script}.js`))) throw new Error('This script does not exist');

  // eslint-disable-next-line import/no-dynamic-require,global-require
  const mod = require(`./${script}`);

  await mod.run();
}

module.exports = {
  run,
};
