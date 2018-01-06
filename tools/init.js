#!/usr/bin/env node

/* eslint-disable no-console,require-jsdoc */

if (process.getuid && process.getuid() === 0) {
    console.error('You have to run this tool as root');
    process.exit(1);
}

if (process.platform === 'win32') {
    console.error('This tool does not work on Windows at this moment');
    process.exit(1);
}

const account = require('./init/account');
const backup = require('./init/backup');
const jwt = require('./init/jwt');
const mysql = require('./init/mysql');
const proxy = require('./init/proxy');
const systemd = require('./init/systemd');


const configuration = {};


//=======================
//     Ask Questions
//=======================

async function askAll() {
    await systemd.askQuestions(configuration);
    await mysql.askQuestions(configuration);
    await backup.askQuestions(configuration);
    await proxy.askQuestions(configuration);
    await jwt.askQuestions(configuration);
    await account.askQuestions(configuration);
}

async function configAll() {
    await systemd.configure(configuration);
    await mysql.configure(configuration);
    await backup.configure(configuration);
    await proxy.configure(configuration);
    await account.configure(configuration);
}

askAll().then(() => {
    return configAll();
}).then(() => {
    console.log('Done configuring');
}).catch(e => {
    console.error('Error while configuring :', e);
});
