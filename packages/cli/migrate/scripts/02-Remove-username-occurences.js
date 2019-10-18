/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    const conInfTableDescription = await queryInterface.describeTable('connectioninformations');
    if (conInfTableDescription.username) {
      await queryInterface.renameColumn('connectioninformations', 'username', 'email');
    }
    if (conInfTableDescription.usernameToken) {
      await queryInterface.renameColumn('connectioninformations', 'usernameToken', 'emailToken');
    }
  },

  async down(queryInterface, Sequelize) {
    const conInfTableDescription = await queryInterface.describeTable('connectioninformations');
    if (conInfTableDescription.email) {
      await queryInterface.renameColumn('connectioninformations', 'email', 'username');
    }
    if (conInfTableDescription.emailToken) {
      await queryInterface.renameColumn('connectioninformations', 'emailToken', 'usernameToken');
    }
  },
};
