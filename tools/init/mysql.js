#!/usr/bin/env node
/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

/**
 *
 * @param configObj Cannot be null
 * @return {Promise<void>}
 */
async function askQuestions(configObj) {

    const questions = [
        {
            type: 'input',
            name: 'dbHost',
            message: 'Hostname?',
            default: 'localhost'
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Privileged username?',
            default: 'root'
        },
        {
            type: 'password',
            name: 'dbPassword',
            message: 'Password?'
        },
        {
            type: 'input',
            name: 'dbName',
            message: 'Database name to use?',
            default: 'kapp'
        }
    ];

    console.log('Configuring Database:');
    const answers = await inquirer.prompt(questions);

    configObj.mysql = {
        root: {
            username: answers.dbUser,
            password: answers.dbPassword
        },
        app: {
            username: 'kapp-u-' + (Math.floor(Math.random() * 9000) + 1000),
            password: crypto.randomBytes(64).toString('hex')
        },
        backup: {
            username: 'kapp-b-' + (Math.floor(Math.random() * 9000) + 1000),
            password: crypto.randomBytes(64).toString('hex')
        },
        host: answers.dbHost,
        database: answers.dbName
    };
}

/**
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
    if (!config.mysql) return;

    const co = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.root.username,
        password: config.mysql.root.password
    });

    try {
        await co.connect();
    } catch (e) {
        console.error('Unable to connect to the database, aborting installation', e);
        return process.exit(1);
    }

    const appUser = config.mysql.app.username;
    const backupUser = config.mysql.backup.username;
    const database = config.mysql.database;

    console.info(`Creating the database ${database}`);
    // TODO Handle when the database already exists
    await co.query(`CREATE DATABASE ${database}`);

    console.info(`Creating app & backup users (${appUser} & ${backupUser})`);

    await co.query(`CREATE USER '${appUser}'@'localhost' IDENTIFIED BY '${config.mysql.app.password}'`);
    await co.query(`CREATE USER '${backupUser}'@'localhost' IDENTIFIED BY '${config.mysql.backup.password}'`);

    console.info('Granting privileges');

    await co.query(`GRANT ALL ON \`${database}\`.* TO '${appUser}'@'localhost'`);
    await co.query(`GRANT SELECT, LOCK TABLES ON \`${database}\`.* TO '${backupUser}'@'localhost'`);

    await co.query('FLUSH PRIVILEGES');

    console.info('Database is initialized');
}


module.exports = {
    askQuestions,
    configure
};
