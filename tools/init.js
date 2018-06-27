#!/usr/bin/env node

/* eslint-disable no-console,require-jsdoc,no-await-in-loop */

if (process.getuid && process.getuid() !== 0) {
  console.error('You have to run this tool as root');
  process.exit(1);
}

if (process.platform === 'win32') {
  console.error('This tool does not work on Windows at this moment');
  process.exit(1);
}

const inquirer = require('inquirer');

const account = require('./prod-scripts/account');
const backup = require('./prod-scripts/backup');
const email = require('./prod-scripts/email');
const jwt = require('./prod-scripts/jwt');
const mysql = require('./prod-scripts/mysql');
const proxy = require('./prod-scripts/proxy');
const systemd = require('./prod-scripts/systemd');
const { systemStartAndEnable } = require('./prod-scripts/util');
const { load } = require('./prod-scripts/loader');


const config = {};


//= ======================
//     Ask Questions
//= ======================

async function askAll() {
  await systemd.askQuestions(config);
  await mysql.askQuestions(config);
  await backup.askQuestions(config);
  await proxy.askQuestions(config);
  await email.askQuestions(config);
  await jwt.askQuestions(config);
  await account.askQuestions(config);
}

async function confirmConfig() {
  console.log('==============================');
  console.log('Current config:');

  systemd.confirmConfig(config);
  mysql.confirmConfig(config);
  backup.confirmConfig(config);
  proxy.confirmConfig(config);
  email.confirmConfig(config);
  jwt.confirmConfig(config);
  account.confirmConfig(config);


  const answers = await inquirer.prompt([{
    type: 'confirm',
    name: 'continue',
    message: 'Do you to proceed with the installation?',
    default: true,
  }]);

  return answers.continue;
}

async function configAll() {
  await systemd.configure(config);
  await mysql.configure(config);
  await backup.configure(config);
  await proxy.configure(config);
  await account.configure(config);
}

async function startEverything() {
  const answers = await inquirer.prompt([{
    type: 'confirm',
    name: 'start',
    message: 'Do you want to start everything needed? (NodeJS, Caddy, Backups, etc.)',
    default: true,
  }]);

  if (!answers.start) return;

  console.log('Starting instances...');

  for (let i = 0; i < config.app.instances; i++) {
    await systemStartAndEnable(`kapp@${config.app.firstPort + i}.service`);
  }

  console.log(`${config.app.instances} instances started!`);

  if (config.backup) {
    console.log('Launching backup task...');
    await systemStartAndEnable('kapp-save.timer');
    console.log('Backup task launched');
  }

  if (config.proxy.caddy.install) {
    console.log('Launching caddy server...');
    await systemStartAndEnable('caddy');
    console.log('Caddy server launched');
  }

  console.log('Everything is started!');
}

async function main() {
  await load(config);

  do await askAll(); while (!await confirmConfig());

  console.log('Starting installation...');
  await configAll();
  console.log('Installation done!');
  await startEverything();
}

main()
  .catch(e => console.error('Error while configuring :', e))
  .then(() => process.exit(0));
