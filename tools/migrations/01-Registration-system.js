/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('members', 'active');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('members', 'active', {
      defaultValue: true,
    });
  },
};
