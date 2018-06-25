/* eslint-disable no-console */
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
const inquirer = require('inquirer');
const util = require('util');


const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const exec = util.promisify(child_process.exec);

/**
 * Create all directories needed.
 *
 * @param pathToCreate
 */
function createDirDeep(pathToCreate) {
  pathToCreate.split(path.sep).reduce((currentPath, folder) => {
    currentPath += folder + path.sep;
    if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
    return currentPath;
  }, '');
}

/**
 * Write a file, but ask if it already exists.
 *
 * @param file Path to the file
 * @param data Content of the file
 * @return {Promise<boolean>} If the file overwrite another
 */
async function overwriteOrNot(file, data) {
  if (fs.existsSync(file)) {
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: `The file '${file}' already exists, overwrite ?`,
      default: false,
    }]);

    if (!overwrite) return true;
  } else {
    createDirDeep(path.dirname(file));
  }

  await writeFile(file, data, 'utf8');
  return false;
}

/**
 * Read a file as UTF-8.
 * Return empty string if failed to read.
 *
 * @param file Path to the file
 * @return {String}
 */
async function readUTF8File(file) {
  try {
    return readFile(file, 'utf8');
  } catch (e) {
    return '';
  }
}

/**
 * Reload systemd with
 * `systemctl daemon-reload`
 * @return {Promise<void>}
 */
async function systemdDaemonReload() {
  console.log('Reloading systemd');
  const { stderr } = await exec('systemctl daemon-reload');
  if (stderr) return console.error('Error while reloading systemd', stderr);
  console.log('Systemd reloaded');
}

/**
 * Start a service and enable it at startup.
 *
 * @param serviceName service name
 * @return {Promise<void>}
 */
async function systemStartAndEnable(serviceName) {
  const { stderr } = await exec(`systemctl enable --now ${serviceName}`);
  if (stderr) return console.error(`Error while enabling and starting service ${serviceName}`, stderr);
}


module.exports = {
  overwriteOrNot,
  createDirDeep,
  systemdDaemonReload,
  systemStartAndEnable,
  readUTF8File,
};
