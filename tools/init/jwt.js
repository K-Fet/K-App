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
            message: 'Do you have a specific JWT Secret?',
            default: 'Generate',
            filter: input => {
                if (input !== 'Generate') return input;
                return crypto.randomBytes(64).toString('hex');
            }
        },
    ];

    console.log('Configuring JWT:');
    const answers = await inquirer.prompt(questions);

    configObj.jwt = {
        secret: answers.jwtSecret
    };
}

module.exports = {
    askQuestions
};
