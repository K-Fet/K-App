/* eslint-disable require-jsdoc,no-unused-vars */
const { Types } = require('mongoose');
const { initModel } = require('k-app-server/bootstrap/sequelize');
const { Role, Permission } = require('k-app-server/app/models');

module.exports = {
  async up(queryInterface, Sequelize, mongoose) {
    const { sequelize } = queryInterface;

    initModel(sequelize);

    await sequelize.sync();

    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
        },
      ],
    });

    const toInsert = roles
      .map(r => r.toJSON())
      .map(r => ({
        createdAt: r.createdAt,
        name: r.name,
        description: r.description,
        permissions: r.permissions.map(p => p.name),
        _oldId: r.id,
      }));

    console.log(`Migrating ${roles.length} roles from MySQL to MongoDB`);

    await mongoose.connection.collection('roles').insertMany(toInsert);
  },

  async down(queryInterface, Sequelize, broker) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
