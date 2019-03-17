/* eslint-disable require-jsdoc,no-unused-vars */
const { Member, Registration } = require('../../../../server/app/models');

module.exports = {
  async up(queryInterface, Sequelize, broker) {
    const { sequelize } = queryInterface;

    Member.init(sequelize);
    Registration.init(sequelize);
    Member.associate({ Registration });
    Registration.associate({ Member });

    await sequelize.sync();

    // Get all members
    const members = await Member.findAll({
      attributes: { exclude: ['deletedAt'] },
      include: [
        {
          model: Registration,
          as: 'registrations',
          attributes: ['year', 'createdAt'],
        },
      ],
    });

    console.log(`Migrating ${members.length} members from MySQL to MongoDB`);

    await broker.call('v1.core.members.insert', { entities: members });
  },

  async down(queryInterface, Sequelize, broker) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
