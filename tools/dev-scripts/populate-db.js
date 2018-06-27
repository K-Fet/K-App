#!/usr/bin/env node

/* eslint-disable no-console,require-jsdoc */
const inquirer = require('inquirer');
const { Sequelize } = require('sequelize');
const models = require('../../server/app/models');
const mysqlConf = require('../prod-scripts/mysql');
const { start: syncPermissions } = require('../../server/bootstrap/permissions');

const {
  Service, Role, Kommission, Barman, Member, Permission,
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
          checked: true,
        },
        {
          name: 'Barmen',
          checked: true,
        },
        {
          name: 'Kommissions',
          checked: true,
        },
        {
          name: 'Roles',
          checked: true,
        },
        {
          name: 'Services',
          checked: true,
        },
      ],
      validate: answer => (answer.length < 1 ? 'You must choose at least one topping.' : true),
    },
  ]);

  // TODO Search for a way to create ConnectionInformation for each barman
}


async function generateKommissions() {
  try {
    await Kommission.bulkCreate([
      {
        name: 'Kom Son',
        description: 'Équipe qui gère la technique du son à la K-Fêt',
      },
      {
        name: 'Kom Light',
        description: 'Équipe qui gère la technique de la lumière à la K-Fêt',
      },
      {
        name: 'Kom Kom',
        description: 'Équipe qui gère la communication de la K-Fêt (affiches, page facebook, …)',
      },
    ]);
    console.log('Kommissions generated!');
  } catch (e) {
    console.error('Error while generating kommissions', e);
  }
}


async function bulkCreateRole(role) {
  const roleInstance = await Role.create(role);

  await roleInstance.setPermissions(role.permissions);
}

async function generateRoles() {
  try {
    await syncPermissions();

    const serviceRead = await Permission.findOne({ where: { name: 'service:read' } });

    const data = [
      {
        name: 'Président',
        description: 'Le meilleur en tout genre, le plus beau',
        permissions: [
          serviceRead,
        ],
      },
      {
        name: 'Trésorier',
        description: 'Celui qui gère la thune de la K-Fêt',
        permissions: [
          serviceRead,
        ],
      },
      {
        name: 'Barman',
        description: 'Servir sans faillir: serviam indeclinabilem',
        permissions: [
          serviceRead,
        ],
      },
    ];

    await Promise.all(data.map(r => bulkCreateRole(r)));

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
    const startDay = new Date();
    startDay.setDate(startDay.getDate() - (startDay.getDay() + 6) % 7);
    startDay.setHours(0, 0, 0, 0);

    const servicesToCreate = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        const dayNoon = new Date(startDay.getTime());
        dayNoon.setHours(12);

        const dayNoonEnd = new Date(dayNoon.getTime());
        dayNoonEnd.setHours(14);

        servicesToCreate.push({
          startAt: dayNoon,
          endAt: dayNoonEnd,
          nbMax: 4,
        });


        if (j !== 4) { // Friday does not have evening service
          const dayEvening = new Date(dayNoon.getTime());
          dayEvening.setHours(19);

          const dayEveningEnd = new Date(dayEvening.getTime());
          dayEveningEnd.setDate(dayNoon.getDate() + 1);
          dayEveningEnd.setHours(1);

          servicesToCreate.push({
            startAt: dayEvening,
            endAt: dayEveningEnd,
            nbMax: 4,
          });
        }

        startDay.setDate(startDay.getDate() + 1);
      }
    }

    await Service.bulkCreate(servicesToCreate);
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

    logging: false,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
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
  const list = config.generate.generateList;

  if (list.includes('Kommissions')) generationTasks.push(generateKommissions());
  if (list.includes('Roles')) generationTasks.push(generateRoles());
  if (list.includes('Members')) generationTasks.push(generateMembers());
  if (list.includes('Barmen')) generationTasks.push(generateBarmen());
  if (list.includes('Services')) generationTasks.push(generateServices());

  await Promise.all(generationTasks);

  console.log('Everything is generated, happy coding!');
}

const conf = {};

mysqlConf.askQuestions(conf)
  .then(() => ask(conf))
  .then(() => generate(conf))
  .catch(e => console.error('Error while generating data', e))
  .then(() => process.exit(0));

