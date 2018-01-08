#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const crypto = require('crypto');
const { hash } = require('../../server/utils/password-manager');
const { Sequelize } = require('sequelize');
const { ConnectionInformation, SpecialAccount } = require('../../server/app/models');


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
        },
        {
            type: 'input',
            name: 'adminUsername',
            message: 'Username of admin (used to connect)?',
            default: 'admin'
        },
        {
            type: 'input',
            name: 'adminCode',
            message: 'Code used to do operations (not the password)?',
            valid: input => !!input
        }
    ];

    console.log('Configuring Account:');
    const answers = await inquirer.prompt(questions);

    if (!answers.createAdmin) return;

    configObj.account = {
        admin: {
            password: crypto.randomBytes(64).toString('hex'),
            code: answers.adminCode,
            username: answers.adminUsername
        }
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

    console.log(`|   |-- Admin username: ${config.account.admin.username}`);
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
    const sequelize = new Sequelize(config.mysql.database, config.mysql.app.username, config.mysql.app.password, {
        host: config.mysql.host,
        dialect: 'mysql',
        timezone: 'Europe/Paris',
    });

    ConnectionInformation.init(sequelize);
    SpecialAccount.init(sequelize);
    SpecialAccount.associate({ ConnectionInformation });

    await SpecialAccount.create({
        code: hash(config.account.admin.code),
        description: 'Administrator',
        connection: {
            password: hash(config.account.admin.password),
            username: config.account.admin.username
        }
    });

    console.info('Administrator created! Here is the password to connect', config.account.admin.password);
}

module.exports = {
    askQuestions,
    confirmConfig,
    configure
};
