#!/usr/bin/env node

/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const { Sequelize } = require('sequelize');
const models = require('../../server/app/models');
const mysqlConf = require('../prod-scripts/mysql');


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
                },
                {
                    name: 'Categories',
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

/**
 * Generate data.
 *
 * @param config
 * @return {Promise<void>}
 */
async function generate(config) {
    // Init sequelize instance
    const sequelize = new Sequelize(config.mysql.database, config.mysql.app.username, config.mysql.app.password, {
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

    const {
        JWT, SpecialAccount, ConnectionInformation, ServiceWrapper,
        Service, RoleWrapper, Role, KommissionWrapper, Kommission,
        Category, Barman, Member
    } = models;


}

const conf = {};

mysqlConf.askQuestions(conf)
    .then(() => ask(conf))
    .then(() => generate(conf))
    .catch(e => console.error('Error while generating data', e));

