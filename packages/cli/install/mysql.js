const crypto = require('crypto');
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const { initModel } = require('k-app-server/bootstrap/sequelize');
const { getSequelizeInstance, testConnection } = require('../utils');

async function setMysqlInfo() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'DB__HOST',
      message: 'MySQL Host?',
      default: 'localhost',
    },
    {
      type: 'input',
      name: 'DB__USERNAME',
      message: 'MySQL Username?',
      default: 'root',
    },
    {
      type: 'password',
      name: 'DB__PASSWORD',
      message: 'MySQL Password?',
    },
    {
      type: 'input',
      name: 'DB__DATABASE',
      message: 'MySQL Database?',
    },
  ]);

  Object.keys(answers).forEach((key) => {
    process.env[key] = answers[key];
  });
}

async function createDatabase(co, database) {
  const [databases] = await co.query(`SHOW DATABASES LIKE '${database}'`);

  if (!databases.length) {
    console.info(`[install] Creating the database ${database}`);
    await co.query(`CREATE DATABASE \`${database}\``);
  }
}

async function createUser(co, database) {
  const user = `${database}-u-${Math.floor(Math.random() * 9000) + 1000}`;
  const password = crypto.randomBytes(32).toString('hex');

  const [users] = await co.query(`SELECT user FROM mysql.user WHERE user LIKE '${database}-u-%'`);
  if (users.length) {
    console.warn(`[install] Found mysql user(s): ${users.map(u => u.user).join(', ')}`);
    console.warn('[install] It should be deleted');
    console.warn('[install] Creating a new user anyway...');
  }
  console.info(`[install] Creating user ${user}`);
  await co.query(`CREATE USER '${user}'@'localhost' IDENTIFIED BY '${password}'`);

  console.info(`[install] Granting privileges to ${user}`);

  await co.query(`GRANT ALL ON \`${database}\`.* TO '${user}'@'localhost'`);
  await co.query('FLUSH PRIVILEGES');

  console.log(`[install] IMPORTANT: Password for user ${user}: ${password}`);
}

async function mysqlInstall() {
  await setMysqlInfo();

  const database = process.env.DB__DATABASE;

  const co = await mysql.createConnection({
    host: process.env.DB__HOST,
    user: process.env.DB__USERNAME,
    password: process.env.DB__PASSWORD,
  });

  await testConnection(co);
  await createDatabase(co, database);
  await createUser(co, database);

  const sequelize = await getSequelizeInstance();
  await initModel(sequelize);

  await sequelize.sync();
}

module.exports = {
  mysqlInstall,
};
