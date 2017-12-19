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
            type: 'confirm',
            name: 'useProxy',
            message: 'Do you want to use a proxy (for HTTPS, Load balancing, ...)?',
            default: true,
        },
        {
            type: 'list',
            name: 'proxyServer',
            choices: ['Caddy Server', 'Nginx', 'Other'],
            message: 'Which proxy do you want to use?',
            when: answers => answers.useProxy
        },
        {
            type: 'confirm',
            name: 'caddyInstall',
            message: 'Do you to install Caddy Server?',
            default: false,
            when: answers => answers.proxyServer === 'Caddy Server'
        },
        {
            type: 'input',
            name: 'siteAddress',
            message: 'What is your site\'s address?',
            validate: input => !!input || 'You must provide an address',
            when: answers => answers.useBackup
        }
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.useProxy) return;

    configObj.proxy = {
        dir: answers.backupDir,
        username: answers.dbUser,
        password: answers.dbPassword
    };

    switch (answers.proxyServer) {
        case 'Caddy Server':
            configObj.proxy.caddy = {
                install: answers.caddyInstall,
                serverAddress: answers.siteAddress
            };
            break;
        case 'Nginx':
            configObj.proxy.nginx = true;
            break;
        case 'Other':
            configObj.proxy.other = true;
            break;
    }
}


async function configure(config) {

}

module.exports = {
    askQuestions,
    configure
};
