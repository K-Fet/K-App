/* eslint-disable require-jsdoc,no-unused-vars */
const { Types } = require('mongoose');
const { initModel } = require('k-app-server/bootstrap/sequelize');
const { Service, Barman } = require('k-app-server/app/models');

const createMap = async (co) => {
  const barmen = await co.collection('users').find({ accountType: 'BARMAN' });

  return {
    barmen: Object.fromEntries(barmen.map(b => [b.account._oldId, b._id])),
  };
};

module.exports = {
  async up(queryInterface, Sequelize, mongoose) {
    const { sequelize } = queryInterface;

    initModel(sequelize);

    await sequelize.sync();

    const { barmen } = await createMap(mongoose.connection);

    const services = await Service.findAll({
      include: [
        {
          model: Barman,
          as: 'barmen',
        },
      ],
    });

    const toInsert = services
      .map(s => s.toJSON())
      .filter(s => !s.deletedAt)
      .map(s => ({
        startAt: s.startAt,
        endAt: s.endAt,
        nbMax: s.nbMax,
        barmen: s.barmen.map(b => barmen[b.id]),
      }));

    console.log(`Migrating ${services.length} services from MySQL to MongoDB`);

    await mongoose.connection.collection('services').insertMany(toInsert);
  },

  async down(queryInterface, Sequelize, broker) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
