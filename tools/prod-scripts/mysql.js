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
            default: configObj.mysql && configObj.mysql.host || 'localhost',
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Privileged username (to create database and users)?',
            default: 'root',
        },
        {
            type: 'password',
            name: 'dbPassword',
            message: 'Password?',
        },
        {
            type: 'input',
            name: 'dbName',
            message: 'Database name to use?',
            default: configObj.mysql && configObj.mysql.database || 'kapp',
        },
    ];

    console.log('Configuring Database:');
    const answers = await inquirer.prompt(questions);

    const currApp = configObj.mysql && configObj.mysql.app;
    const currBackup = configObj.mysql && configObj.mysql.backup;

    configObj.mysql = {
        root: {
            username: answers.dbUser,
            password: answers.dbPassword,
        },
        app: {
            username: currApp && currApp.username || `kapp-u-${ Math.floor(Math.random() * 9000) + 1000}`,
            password: currApp && currApp.password || crypto.randomBytes(32).toString('hex'),
        },
        backup: {
            username: currBackup && currBackup.username || `kapp-b-${ Math.floor(Math.random() * 9000) + 1000}`,
            password: currBackup && currBackup.password || crypto.randomBytes(32).toString('hex'),
        },
        host: answers.dbHost,
        database: answers.dbName,
    };
}

/**
 * Display config.
 *
 * @param config
 */
function confirmConfig(config) {
    console.log('|-- Database config:');
    console.log(`|   |-- Hostname: ${config.mysql.host}`);
    console.log(`|   |-- Database name: ${config.mysql.database}`);
    console.log(`|   |-- Privileged username: ${config.mysql.root.username}`);
}


/**
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
    if (!config.mysql) return;

    const co = await mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.root.username,
        password: config.mysql.root.password,
    });

    try {
        await co.query('SELECT 1+1 AS CoTest');
    } catch (e) {
        console.error('Unable to connect to the database, aborting installation', e);
        return process.exit(1);
    }

    const appUser = config.mysql.app.username;
    const backupUser = config.mysql.backup.username;
    const database = config.mysql.database;

    const [rows] = await co.query(`SHOW DATABASES LIKE '${database}'`);

    if (rows.length > 0) {
        const { doContinue } = await inquirer.prompt([{
            type: 'confirm',
            name: 'doContinue',
            message: `The database ${database} already exists, overwrite (WARNING: Everything will be deleted)?`,
            default: false,
        }]);

        if (!doContinue) {
            console.log('Skipping mysql configuration!');
            return;
        }

        await co.query(`DROP DATABASE ${database}`);
    }

    console.info(`Creating the database ${database}`);
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
    confirmConfig,
    configure,
};
