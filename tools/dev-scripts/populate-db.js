#!/usr/bin/env node

/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const { Sequelize } = require('sequelize');
const models = require('../../server/app/models');
const mysqlConf = require('../prod-scripts/mysql');

const {
    JWT, SpecialAccount, ConnectionInformation, ServiceWrapper,
    Service, RoleWrapper, Role, KommissionWrapper, Kommission,
    Category, Barman, Member
} = models;


async function ask(conf) {
    console.log('This script will populate your database with fake data, let\'s start!');

    conf.generate = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'generateList',
            message: 'What do you want to generate?',
            choices: [
                {
                    name: 'Members',
                    checked: true
                },
                {
                    name: 'Barmen',
                    checked: true
                },
                {
                    name: 'Kommissions',
                    checked: true
                },
                {
                    name: 'Roles',
                    checked: true
                },
                {
                    name: 'Services',
                    checked: true
                }
            ],
            validate: answer => answer.length < 1 ? 'You must choose at least one topping.' : true
        },
        {
            type: 'input',
            name: 'nbMembers',
            message: 'How many members do you want?',
            default: 200,
            validate: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            },
            when: answers => answers.generateList
        }
    ]);

    // TODO Search for a way to create ConnectionInformation for each barman
}


async function generateKommissions() {
    try {
        await Kommission.bulkCreate([
            { name: 'Kom Son', description: 'Équipe qui gère la technique du son à la K-Fêt' },
            { name: 'Kom Light', description: 'Équipe qui gère la technique de la lumière à la K-Fêt' },
            {
                name: 'Kom Kom',
                description: 'Équipe qui gère la communication de la K-Fêt (affiches, page facebook, …)'
            }
        ]);
        console.log('Kommissions generated!');
    } catch (e) {
        console.error('Error while generating kommissions', e);
    }
}

async function generateRoles() {
    try {
        await Role.bulkCreate([
            { name: 'Président', description: 'Le meilleur en tout genre, le plus beau' },
            { name: 'Trésorier', description: 'Celui qui gère la thune de la K-Fêt' },
            { name: 'Barman', description: 'Servir sans faillir: serviam indeclinabilem' }
        ]);
        console.log('Roles generated!');
    } catch (e) {
        console.error('Error while generating roles', e);
    }
}

async function generateMembers() {
    try {

        await Member.bulkCreate(require('./data/members'));

        console.log('Members generated!');
    } catch (e) {
        console.error('Error while generating members', e);
    }
}

async function generateBarmen() {
    try {
        await Barman.bulkCreate(require('./data/barmen'));
        console.log('Barmen generated!');
    } catch (e) {
        console.error('Error while generating barmen', e);
    }
}

async function generateServices() {
    try {

        console.log('Services generated!');
    } catch (e) {
        console.error('Error while generating services', e);
    }
}


/**
 * Generate data.
 *
 * @param config
 * @return {Promise<void>}
 */
async function generate(config) {
    // Init sequelize instance
    const sequelize = new Sequelize(config.mysql.database, config.mysql.root.username, config.mysql.root.password, {
        host: config.mysql.host,
        dialect: 'mysql',

        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci'
        },
    });

    // Call init for all models

    for (const m of Object.values(models)) m.init(sequelize);

    // Load model associations
    for (const m of Object.values(models)) {
        if (typeof m.associate === 'function') {
            m.associate(models);
        }
    }

    await sequelize.sync();

    const generationTasks = [];

    if (config.generate.Kommissions) generationTasks.push(generateKommissions());
    if (config.generate.Roles) generationTasks.push(generateRoles());
    if (config.generate.Members) generationTasks.push(generateMembers());
    if (config.generate.Barmen) generationTasks.push(generateBarmen());
    if (config.generate.Services) generationTasks.push(generateServices());

    await Promise.all(generationTasks);

    console.log('Everything is generated, happy coding!');
}

const conf = {};

mysqlConf.askQuestions(conf)
    .then(() => ask(conf))
    .then(() => generate(conf))
    .catch(e => console.error('Error while generating data', e));

