#!/usr/bin/env node
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
            name: 'dbHost',
            message: 'Hostname?',
            default: 'localhost'
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Username?',
            default: 'kapp'
        },
        {
            type: 'password',
            name: 'dbPassword',
            message: 'Password?'
        },
        {
            type: 'input',
            name: 'dbName',
            message: 'Database name?',
            default: 'kapp'
        }
    ];

    const answers = await inquirer.prompt(questions);

    configObj.mysql = {
        host: answers.dbHost,
        username: answers.dbUser,
        password: answers.dbPassword,
        database: answers.dbName
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
