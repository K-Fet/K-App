/* eslint-disable require-jsdoc,no-unused-vars */
const { Member, Registration } = require('k-app-server/app/models');

module.exports = {
  async up(queryInterface, Sequelize, mongoose) {
    const { sequelize } = queryInterface;

    Member.init(sequelize);
    Registration.init(sequelize);
    Member.associate({ Registration });
    Registration.associate({ Member });

    await sequelize.sync();

    // Get all members
    const members = await Member.unscoped().findAll({
      attributes: { exclude: ['deletedAt', 'id'] },
      include: [
        {
          model: Registration,
          as: 'registrations',
          attributes: ['year', 'createdAt'],
        },
      ],
    });

    console.log(`Migrating ${members.length} members from MySQL to MongoDB`);

    await mongoose.connection.collection('members').insertMany(members.map(m => m.toJSON()));
  },

  async down(queryInterface, Sequelize, broker) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
