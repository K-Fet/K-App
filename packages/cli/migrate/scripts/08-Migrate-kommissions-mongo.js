/* eslint-disable require-jsdoc,no-unused-vars */
const { Types } = require('mongoose');
const { initModel } = require('k-app-server/bootstrap/sequelize');
const { Kommission } = require('k-app-server/app/models');

module.exports = {
  async up(queryInterface, Sequelize, mongoose) {
    const { sequelize } = queryInterface;

    initModel(sequelize);

    await sequelize.sync();

    const kommissions = await Kommission.findAll({});

    const toInsert = kommissions
      .map(r => r.toJSON())
      .map(r => ({
        createdAt: r.createdAt,
        name: r.name,
        description: r.description,
        _oldId: r.id,
      }));

    console.log(`Migrating ${kommissions.length} kommissions from MySQL to MongoDB`);

    await mongoose.connection.collection('kommissions').insertMany(toInsert);
  },

  async down(queryInterface, Sequelize, broker) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
