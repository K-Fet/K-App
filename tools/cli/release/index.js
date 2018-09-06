/* eslint-disable no-console,camelcase */
const child_process = require('child_process');
const util = require('util');
const opn = require('opn');
const serverPackage = require('../../../package');

const exec = util.promisify(child_process.exec);
const NEW_RELEASE_URL = `${serverPackage.repository.url}/releases/new`;

async function run() {
  const newVersion = process.argv[3];

  await exec(`yarn version --new-version ${newVersion}`);
  await exec('git push --follow-tags');
  await opn(NEW_RELEASE_URL, { wait: false });
}

module.exports = {
  run,
};
