#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const path = require('path');
const util = require('util');
const { overwriteOrNot } = require('./util');
const exec = util.promisify(require('child_process').exec);

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

    console.log('Configuring Proxy:');
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

/**
 * Install component.
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
    if (!config.proxy || !config.proxy.caddy) return;

    const clientFolder = path.resolve(__dirname, '../../client/dist/');

    let backendList = '';

    for (let i = 0; i < config.app.instances; i++) {
        // TODO When proxy is not on localhost
        backendList += `localhost:${config.app.firstPort + i} `;
    }

    const caddyFile = `
${config.proxy.caddy.serverAddress} { # Your site's address

    # Serve client app
    root ${clientFolder}
    
    # Compress responses
    gzip
    
    # Set usefull headers
    header / {
        # Cache application for one day
        Cache-Control "public, max-age=86400"
    }
    
    # Log everything to stdout, treated by journalctl
    log stdout
    
    # Proxy request for API
    proxy /api ${backendList}{
        policy round_robin      # Use round robin for the backend
        fail_timeout 5m         # Time before considering a backend down
        try_duration 4s         # How long proxy will try to find a backend
        transparent             # Set headers as the proxy except
    }
}
`;

    await overwriteOrNot('/srv/caddy/Caddyfile', caddyFile);

    if (!config.proxy.caddy.install) return;

    console.log('Installing Caddy Server');
    const { stderr } = await exec('curl https://getcaddy.com | bash -s personal http.cache');
    console.error('Error while installation:', stderr);
    console.log('Caddy Server installed');
}

module.exports = {
    askQuestions,
    configure
};
