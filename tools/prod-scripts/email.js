#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');

/**
 *
 * @param configObj Cannot be null
 * @return {Promise<void>}
 */
async function askQuestions(configObj) {

    const questions = [
        {
            type: 'input',
            name: 'host',
            message: 'SMTP hostname?'
        },
        {
            type: 'input',
            name: 'port',
            message: 'Port of the SMTP server?',
            default: 587,
            validate: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        },
        {
            type: 'input',
            name: 'user',
            message: 'Username (email) to use?'
        },
        {
            type: 'password',
            name: 'pass',
            message: 'Password for the email?'
        }
    ];

    console.log('Configuring Email:');
    const answers = await inquirer.prompt(questions);

    configObj.email = {
        host: answers.host,
        port: answers.port,
        user: answers.user,
        pass: answers.pass,
    };
}

/**
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
    console.log('|-- Email config:');
    console.log(`|   |-- Hostname: ${config.email.host}`);
    console.log(`|   |-- Port name: ${config.email.port}`);
    console.log(`|   |-- Email used to send mails: ${config.email.user}`);
}


module.exports = {
    askQuestions,
    confirmConfig
};
