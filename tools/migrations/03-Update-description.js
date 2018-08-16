/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('kommissions', 'description', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('roles', 'description', {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('kommissions', 'description', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('roles', 'description', {
      type: Sequelize.STRING,
    });
  },
};
