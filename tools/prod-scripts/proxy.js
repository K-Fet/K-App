#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const path = require('path');
const util = require('util');
const { overwriteOrNot, systemdDaemonReload } = require('./util');
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
            when: answers => answers.proxyServer === 'Caddy Server'
        }
    ];

    console.log('Configuring Proxy:');
    const answers = await inquirer.prompt(questions);

    if (!answers.useProxy) return;

    configObj.proxy = {
        title: answers.proxyServer
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
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
    console.log('|-- Proxy config:');
    if (!config.proxy) {
        console.log('|   |-- Do not use proxy!');
        return;
    }
    console.log(`|   |-- Proxy used: ${config.proxy.title}`);

    if (config.proxy.caddy) {
        console.log(`|   |-- Install caddy: ${config.proxy.caddy.install ? 'Yes' : 'No'}`);
        console.log(`|   |-- Server address: ${config.proxy.caddy.serverAddress}`);
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

    await configureCaddy(config);
}


async function configureCaddy(config) {

    const CADDYFILE_PATH = '/srv/caddy/Caddyfile';
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

    await overwriteOrNot(CADDYFILE_PATH, caddyFile);

    if (!config.proxy.caddy.install) return;

    console.log('Installing Caddy Server');
    const { stderr } = await exec('curl https://getcaddy.com --fail --silent --show-error | bash -s personal http.cache');
    if (stderr) return console.error('Error while installation:', stderr);

    const caddyService = `
[Unit]
Description=Caddy HTTP/2 web server
Documentation=https://caddyserver.com/docs
After=network-online.target
Wants=network-online.target systemd-networkd-wait-online.service

[Service]
Restart=on-abnormal

; User and group the process will run as.
User=www-data
Group=www-data

; Letsencrypt-issued certificates will be written to this directory.
Environment=CADDYPATH=/etc/ssl/caddy

; Always set "-root" to something safe in case it gets forgotten in the Caddyfile.
ExecStart=/usr/local/bin/caddy -log stdout -agree=true -conf=${CADDYFILE_PATH} -root=/var/tmp
ExecReload=/bin/kill -USR1 $MAINPID

; Use graceful shutdown with a reasonable timeout
KillMode=mixed
KillSignal=SIGQUIT
TimeoutStopSec=5s

LimitNOFILE=1048576
LimitNPROC=512

PrivateTmp=true
PrivateDevices=true
ProtectHome=true
ProtectSystem=full
ReadWriteDirectories=/etc/ssl/caddy

CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target`;

    await overwriteOrNot('/etc/systemd/system/caddy.service', caddyService);

    console.log('Caddy Server installed');

    await systemdDaemonReload();
}

module.exports = {
    askQuestions,
    confirmConfig,
    configure
};
