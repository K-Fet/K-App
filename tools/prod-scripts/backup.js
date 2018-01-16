#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const path = require('path');
const { overwriteOrNot, createDirDeep } = require('./util');


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
            name: 'deleteAfter',
            choices: ['daily', 'hourly', 'weekly', 'monthly'],
            message: 'Delete backup after how many days (0 for never)?',
            default: 30,
            when: answers => answers.useBackup,
            valid: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        }
    ];

    console.log('Configuring Backups:');
    const answers = await inquirer.prompt(questions);

    if (!answers.useBackup) return;

    configObj.backup = {
        dir: answers.backupDir,
        frequency: answers.frequency,
        deleteAfter: answers.deleteAfter
    };
}


/**
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
    console.log('|-- Backup config:');
    if (!config.backup) {
        console.log('|   |-- Do not backup!');
        return;
    }
    console.log(`|   |-- Location for backups: ${config.backup.dir}`);
    console.log(`|   |-- Frequency: ${config.backup.frequency}`);
    console.log(`|   |-- Delete backups after: ${config.backup.deleteAfter} days`);
}


/**
 * Install component.
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
    if (!config.backup) return;

    const timerFile = `
[Unit]
Description=Timer for daily backup of %i

[Timer]
OnCalendar=${config.backup.frequency}
Persistent=true

[Install]
WantedBy=timers.target
`;

    const backupFile = `
[Unit]
Description=Schedule of a backup of the k-app database

[Service]
Type=oneshot
ExecStart=${path.resolve(__dirname, '..', 'save-all.sh')}

Environment=BACKUP_DIR=${config.backup.dir}
Environment=MYSQL_UNAME=${config.mysql.backup.username}
Environment=MYSQL_PWORD=${config.mysql.backup.password}
Environment=MYSQL_DATABASE_NAME=${config.mysql.database}
Environment=KEEP_BACKUPS_FOR=${config.backup.deleteAfter}
`;


    // Create backup folder
    await createDirDeep(config.backup.dir);

    await overwriteOrNot('/etc/systemd/system/kapp-save.timer', timerFile);
    await overwriteOrNot('/etc/systemd/system/kapp-save.service', backupFile);
}

module.exports = {
    askQuestions,
    confirmConfig,
    configure
};
