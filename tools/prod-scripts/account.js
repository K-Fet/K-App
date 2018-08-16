#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const crypto = require('crypto');
const Joi = require('joi');
const { Sequelize } = require('sequelize');
const { hash } = require('../../server/utils/password-manager');
const { ConnectionInformation, SpecialAccount, Permission } = require('../../server/app/models');
const mysqlConf = require('./mysql');
const { start: syncPermissions } = require('../../server/bootstrap/permissions');

const isCLI = require.main === module;

/**
 *
 * @param configObj Cannot be null
 * @return {Promise<void>}
 */
async function askQuestions(configObj) {
  const questions = [
    {
      type: 'confirm',
      name: 'createAdmin',
      message: 'Do you want to create an admin account?',
      default: false,
      when: !isCLI,
    },
    {
      type: 'input',
      name: 'adminEmail',
      message: 'Email for admin?',
      valid: input => Joi.validate(input, Joi.string().email(), { presence: 'required' }),
    },
    {
      type: 'password',
      name: 'adminPassword',
      message: 'Password for admin, leave blank to generate one (recommended on prod)?',
    },
    {
      type: 'input',
      name: 'adminCode',
      message: 'Code used to do operations (not the password)?',
      valid: input => !!input,
    },
  ];

  console.log('Configuring Account:');
  const answers = await inquirer.prompt(questions);

  if (!answers.createAdmin && !isCLI) return;

  configObj.account = {
    admin: {
      password: answers.adminPassword || crypto.randomBytes(10)
        .toString('hex'),
      code: answers.adminCode,
      email: answers.adminEmail,
    },
  };
}


/**
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
  console.log('|-- Account config:');
  if (!config.account) {
    console.log('|   |-- Do not create admin account!');
    return;
  }

  console.log(`|   |-- Admin email: ${config.account.admin.email}`);
}


/**
 * Install component.
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
  if (!config.account) return;

  // Init sequelize instance
  const sequelize = new Sequelize(config.mysql.database, config.mysql.root.username, config.mysql.root.password, {
    host: config.mysql.host,
    dialect: 'mysql',

    logging: false,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  });

  ConnectionInformation.init(sequelize);
  SpecialAccount.init(sequelize);
  Permission.init(sequelize);
  SpecialAccount.associate({
    ConnectionInformation,
    Permission,
  });

  await sequelize.sync();
  await syncPermissions();

  const admin = await SpecialAccount.create(
    {
      code: await hash(config.account.admin.code),
      description: 'Administrator',
      connection: {
        password: await hash(config.account.admin.password),
        email: config.account.admin.email,
      },
    },
    {
      include: [
        {
          model: ConnectionInformation,
          as: 'connection',
        },
      ],
    },
  );

  const allPerms = await Permission.findAll();

  await admin.setPermissions(allPerms);

  console.log('Administrator created! Here is the password to connect', config.account.admin.password);
}


if (isCLI) {
  console.log('You must have created a database for the app!');
  const config = {};

  mysqlConf.askQuestions(config)
    .then(() => askQuestions(config))
    .then(() => configure(config))
    .catch(e => console.error('Error:', e))
    .then(() => process.exit(0));
}


module.exports = {
  askQuestions,
  confirmConfig,
  configure,
};
