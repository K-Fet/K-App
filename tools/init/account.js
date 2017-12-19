#!/usr/bin/env node
const inquirer = require('inquirer');
const crypto = require('crypto');

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
            message: 'Do you want to create the admin account?',
            default: false,
        },
        {
            type: 'input',
            name: 'adminUsername',
            message: 'Username of admin (used to connect)?',
            default: 'admin'
        }
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.createAdmin) return;

    configObj.account = {
        [answers.adminUsername]: {
            password: crypto.randomBytes(64).toString('hex')
        }
    };
}

/**
 * Install component.
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {

}

module.exports = {
    askQuestions,
    configure
};
