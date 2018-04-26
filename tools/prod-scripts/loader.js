#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const { readUTF8File } = require('./util');


/**
 *
 * @param config
 * @return {Promise<void>}
 */
async function load(config) {
    const questions = [
        {
            type: 'confirm',
            name: 'loadConfig',
            message: 'Do you want to search for existing config?',
            default: true,
        },
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.loadConfig) return;

    const systemdFile = await readUTF8File('/etc/systemd/system/kapp@.service');
    const timerFile = await readUTF8File('/etc/systemd/system/kapp-save.timer');
    const backupFile = await readUTF8File('/etc/systemd/system/kapp-save.service');
    const caddyFile = await readUTF8File('/srv/caddy/Caddyfile');

    config.proxy = {};

    config.app = {
        publicUrl: matchInFile(
            // eslint-disable-next-line no-useless-escape
            /PUBLIC_URL=https:\/\/((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))\//,
            systemdFile,
        ),
        firstPort: matchInFile(/proxy\s\/api\slocalhost:(\d{2,6})/, caddyFile),
        instances: matchInFile(/proxy\s\/api(\slocalhost:\d{2,6})*\slocalhost:(\d{2,6})/, caddyFile, 2) -
        matchInFile(/proxy\s\/api\slocalhost:(\d{2,6})/, caddyFile) + 1,
    };

    config.mysql = {
        host: matchInFile(/DB_HOST=(.+)$/, systemdFile),
        database: matchInFile(/DB_DATABASE=(.+)$/, systemdFile),
        app: {
            username: matchInFile(/DB_USER=(.+)$/, systemdFile),
            password: matchInFile(/DB_PWD=(.+)$/, systemdFile),
        },
        backup: {
            username: matchInFile(/MYSQL_UNAME=(.+)$/, backupFile),
            password: matchInFile(/MYSQL_PWORD=(.+)$/, backupFile),
        },
    };

    config.email = {
        host: matchInFile(/EMAIL_HOST=(.+)$/, systemdFile),
        port: matchInFile(/EMAIL_PORT=(.+)$/, systemdFile),
        user: matchInFile(/EMAIL_USER=(.+)$/, systemdFile),
        pass: matchInFile(/EMAIL_PASS=(.+)$/, systemdFile),
    };

    config.jwt = {
        secret: matchInFile(/JWT_SECRET=(.+)$/, systemdFile),
    };

    config.backup = {
        frequency: matchInFile(/OnCalendar=(.+)$/, timerFile),
        dir: matchInFile(/BACKUP_DIR=(.+)$/, timerFile),
        deleteAfter: matchInFile(/KEEP_BACKUPS_FOR=(.+)$/, timerFile),
    };
}

/**
 * Match a regex to a file.
 * Also convert to number if possible
 *
 * Return the second item from the tab (the first group of the regex)
 *
 * @param regex {RegExp}
 * @param file {String}
 * @param match {Number}
 * @return {String|Number}
 */
function matchInFile(regex, file, match = 1) {
    const res = file.match(regex);

    if (!res || !res[match]) return undefined;

    // Try to parse to number
    const val = res[match] * 1;

    if (isNaN(val)) return res[match];
    return val;
}

module.exports = {
    load,
};