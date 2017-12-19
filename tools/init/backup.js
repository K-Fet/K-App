#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');

/**
 *
 * @param configObj Cannot be null
 * @return {Promise<void>}
 */
async function askQuestions(configObj) {

    const questions = [
        {
            type: 'confirm',
            name: 'useBackup',
            message: 'Do you want to setup a automatic backup?',
            default: true
        },
        {
            type: 'input',
            name: 'backupDir',
            message: 'Where do you want your backups?',
            default: path.resolve(__dirname, '..', '..', 'backups'),
            when: answers => answers.useBackup
        },
        {
            type: 'list',
            name: 'frequency',
            choices: ['daily', 'hourly', 'weekly', 'monthly'],
            message: 'How often would you want to make a backup?',
            default: 'daily',
            when: answers => answers.useBackup
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Username?',
            default: () => {
                if (configObj.mysql && configObj.mysql.username) {
                    return configObj.mysql.username;
                }
                return 'kapp';
            },
            when: answers => answers.useBackup
        },
        {
            type: 'password',
            name: 'dbPassword',
            message: 'Password?',
            default: () => {
                if (configObj && configObj.mysql && configObj.mysql.password) {
                    return configObj.mysql.password;
                }
                return 'kapp';
            },
            when: answers => answers.useBackup
        },
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.useBackup) return;

    configObj.backup = {
        dir: answers.backupDir,
        username: answers.dbUser,
        password: answers.dbPassword
    };
}


async function configure(config) {

}

module.exports = {
    askQuestions,
    configure
};
