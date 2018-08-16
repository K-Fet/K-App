#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc,no-param-reassign,no-mixed-operators,no-bitwise */
const inquirer = require('inquirer');
const path = require('path');
const appPackage = require('../../package');
const { overwriteOrNot, systemdDaemonReload } = require('./util');


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
      default: configObj.app && configObj.app.instances || 4,
      validate: (input) => {
        if (input >>> 0 === parseFloat(input)) return true;
        return 'You must enter a positive integer';
      },
    },
    {
      type: 'input',
      name: 'firstPort',
      message: 'What is the port of the first instance?',
      default: configObj.app && configObj.app.firstPort || 3000,
      validate: (input) => {
        if (input >>> 0 === parseFloat(input)) return true;
        return 'You must enter a positive integer';
      },
    },
    {
      type: 'input',
      name: 'publicUrl',
      default: configObj.app && configObj.app.publicUrl,
      message: 'What is the DNS ? (e.g.: `example.com`)',
      validate: input => !!input || 'A DNS is required for emails (and Caddy)',
    },
    {
      type: 'input',
      name: 'contactEmailLost',
      default: configObj.app && configObj.app.publicUrl && `sg@${configObj.app.publicUrl}`,
      message: 'What are the lost objects email addresses ? (comma separated)',
    },
    {
      type: 'input',
      name: 'contactEmailConcert',
      default: configObj.app && configObj.app.publicUrl && `concert@${configObj.app.publicUrl}`,
      message: 'What are the concert event email addresses ? (comma separated)',
    },
    {
      type: 'input',
      name: 'contactEmailEvent',
      default: configObj.app && configObj.app.publicUrl && `sg@${configObj.app.publicUrl}, president@${configObj.app.publicUrl}`,
      message: 'What are events email addresses ? (comma separated)',
    },
    {
      type: 'input',
      name: 'contactEmailWebsite',
      default: configObj.app && configObj.app.publicUrl && `webmaster@${configObj.app.publicUrl}`,
      message: 'What are the website problem email addresses ? (comma separated)',
    },
    {
      type: 'input',
      name: 'recaptachaSecret',
      message: 'What is the Recaptacha Secret?',
      default: configObj.app && configObj.app.recaptacha && configObj.app.recaptacha.secret,
      validate: input => !!input || 'A Recaptacha secret is required for contact forms!',
    },
    {
      type: 'input',
      name: 'recaptachaSiteKey',
      message: 'What is the Recaptacha Site Key?',
      default: configObj.app && configObj.app.recaptacha && configObj.app.recaptacha.siteKey,
      validate: input => !!input || 'A Recaptacha site key is required for contact forms!',
    },
  ];

  console.log('Configuring application:');
  const answers = await inquirer.prompt(questions);

  configObj.app = {
    instances: answers.instanceNum,
    firstPort: answers.firstPort,
    publicUrl: answers.publicUrl,
    recaptacha: {
      secret: answers.recaptachaSecret,
      siteKey: answers.recaptachaSiteKey,
    },
    contact: {
      concert: answers.contactEmailConcert,
      lost: answers.contactEmailLost,
      event: answers.contactEmailEvent,
      website: answers.contactEmailWebsite,
    },
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
Environment=PUBLIC_URL=https://${config.app.publicUrl}/
Environment=TRUSTED_PROXY=${config.proxy ? 'loopback' : ''}

Environment=DB_HOST=${config.mysql.host}
Environment=DB_USER=${config.mysql.app.username}
Environment=DB_PWD=${config.mysql.app.password}
Environment=DB_DATABASE=${config.mysql.database}


Environment=EMAIL_HOST=${config.email.host}
Environment=EMAIL_PORT=${config.email.port}
Environment=EMAIL_USER=${config.email.user}
Environment=EMAIL_PASS=${config.email.pass}

Environment=CONCERT_MAIL=${config.app.contact.concert}
Environment=EVENT_MAIL=${config.app.contact.event}
Environment=LOST_MAIL=${config.app.contact.lost}
Environment=WEBSITE_MAIL=${config.app.contact.website}

Environment=RECAPTACHA_SITE_KEY=${config.app.recaptacha.siteKey}
Environment=RECAPTACHA_SECRET=${config.app.recaptacha.secret}

Environment=JWT_SECRET=${config.jwt.secret}

Environment=NODE_ENV=production

Type=simple
WorkingDirectory=${root}
ExecStart=/usr/bin/node server/index.js
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

  await systemdDaemonReload();
}

module.exports = {
  askQuestions,
  confirmConfig,
  configure,
};
