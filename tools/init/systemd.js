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
            message: 'How many instances?',
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
Environment=DB_USER=${config.mysql.username}
Environment=DB_PWD=${config.mysql.password}
Environment=DB_DATABASE=${config.mysql.database}

Environment=JWT_SECRET=${config.jwt.secret}


Type=simple                         # No child process
WorkingDirectory=${root}            # Set working directory
ExecStart=/usr/bin/npm run prod     # Run command line
Restart=on-failure                  # Restart only on failure (exit > 0)
RestartSec=10                       # Minimum duration the server must be up

# Logging
StandardOutput=syslog
StandardError=syslog

# Security
DynamicUser=yes                     # See https://www.freedesktop.org/software/systemd/man/systemd.exec.html#DynamicUser=
CapabilityBoundingSet=${config.app.firstPort <= 1024 ? 'CAP_NET_BIND_SERVICE' : ''}
NoNewPrivileges=yes                 # Prevent privilege escalation
ProtectControlGroups=yes
ProtectKernelModules=yes

[Install]
WantedBWantedBy=multi-user.target
`;

    await overwriteOrNot('/etc/systemd/system/kapp@.service', serviceFile);
}

module.exports = {
    askQuestions,
    configure
};
