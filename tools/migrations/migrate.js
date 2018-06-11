#!/usr/bin/ env node
/* eslint-disable no-console */
const Umzug = require('umzug');
const Sequelize = require('sequelize');
const mysqlConf = require('../prod-scripts/mysql');


/**
 * Ask the user for database information and load an sequelize with it.
 *
 * @return {Promise<Sequelize>} Sequelize instance
 */
async function getSequelizeInstance() {
    const conf = {};
    await mysqlConf.askQuestions(conf);

    const sequelize = new Sequelize({
        host: conf.mysql.host,
        username: conf.mysql.root.username,
        password: conf.mysql.root.password,
        database: conf.mysql.database,
        dialect: process.env.DB_DIALECT || 'mysql',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    });

    try {
        await sequelize.authenticate();
    } catch (e) {
        console.error('Error while authenticate sequelize: %o', e);
        throw new Error('Unable to authenticate in sequelize, please check your credentials');
    }

    return sequelize;
}

/**
 * Return an instance of umzug ready to be used.
 *
 * @param sequelize {Sequelize} ready to use sequelize instance.
 * @return {Promise<Umzug|*>} Umzug instance
 */
async function getUmzugInstance(sequelize) {
    return new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize,

        },
        migrations: {
            params: [sequelize.getQueryInterface(), Sequelize],
            path: __dirname,
            pattern: /^\d+-[\w-]+\.js$/,
        },
    });
}

/**
 * Main migrate function.
 *
 * @return {Promise<void>}
 */
async function main() {
    console.log('Migration started');

    const sequelize = await getSequelizeInstance();
    const umzug = await getUmzugInstance(sequelize);

    const migrations = await umzug.up();

    console.log(`Migration done, applied ${migrations.length} update scripts:`);

    for (const m of migrations) {
        console.log(`\t- ${m.file}`);
    }
}


main()
    .catch(e => console.error('Error while migrating database: %o', e))
    .then(() => process.exit(0));
