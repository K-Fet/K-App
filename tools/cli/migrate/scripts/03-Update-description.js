/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Kommissions', 'description', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('Roles', 'description', {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Kommissions', 'description', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('Roles', 'description', {
      type: Sequelize.STRING,
    });
  },
};
