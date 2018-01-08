#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
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
            type: 'input',
            name: 'jwtSecret',
            message: 'Do you have a specific JWT secret (a new one will be generated otherwise)?'
        },
    ];

    console.log('Configuring JWT:');
    const answers = await inquirer.prompt(questions);

    configObj.jwt = {
        secret: answers.jwtSecret || crypto.randomBytes(32).toString('hex'),
        isNew: !!answers.jwtSecret
    };
}

/**
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
    console.log('|-- JWT config:');
    console.log(`|   |-- Use a new JWT secret: ${config.jwt.isNew ? 'Yes' : 'No'}`);
}


module.exports = {
    askQuestions,
    confirmConfig
};
