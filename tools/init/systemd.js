#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const path = require('path');
const appPackage = require('../../package');
const { overwriteOrNot } = require('./util');


/**
 *
 * @param configObj
 * @return {Promise<void>}
 */
async function askQuestions(configObj) {
    const questions = [
        {
            type: 'input',
            name: 'instanceNum',
            message: 'How many instances do you want to use?',
            default: 4,
            validate: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        },
        {
            type: 'input',
            name: 'firstPort',
            message: 'What is the port of the first instance?',
            default: 3000,
            validate: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        }
    ];

    console.log('Configuring application:');
    const answers = await inquirer.prompt(questions);

    configObj.app = {
        instances: answers.instanceNum,
        firstPort: answers.firstPort
    };
}

/**
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
    console.log('|-- Application config:');
    console.log(`|   |-- Number of instances: ${config.app.instances}`);
    console.log(`|   |-- Starting port of instances: ${config.app.firstPort}`);
}


/**
 * Install component.
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
    const root = path.resolve(__dirname, '..', '..');

    const serviceFile = `
[Unit]
Description=${appPackage.description}
Documentation=${appPackage.repository}
After=network.target mysql.service

[Service]

Environment=PORT=%i
Environment=HOSTNAME=${config.proxy ? 'localhost' : ''}

Environment=DB_HOST=${config.mysql.host}
Environment=DB_USER=${config.mysql.app.username}
Environment=DB_PWD=${config.mysql.app.password}
Environment=DB_DATABASE=${config.mysql.database}

Environment=JWT_SECRET=${config.jwt.secret}


Type=simple
WorkingDirectory=${root}
ExecStart=/usr/bin/npm run prod
Restart=on-failure
RestartSec=10

# Logging
StandardOutput=syslog
StandardError=syslog

# Security
DynamicUser=yes
CapabilityBoundingSet=${config.app.firstPort <= 1024 ? 'CAP_NET_BIND_SERVICE' : ''}
NoNewPrivileges=yes
ProtectControlGroups=yes
ProtectKernelModules=yes

[Install]
WantedBy=multi-user.target
`;

    await overwriteOrNot('/etc/systemd/system/kapp@.service', serviceFile);
}

module.exports = {
    askQuestions,
    confirmConfig,
    configure
};
