/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    const conInfTableDescription = await queryInterface.describeTable('ConnectionInformations');
    if (conInfTableDescription.username) {
      await queryInterface.renameColumn('ConnectionInformations', 'username', 'email');
    }
    if (conInfTableDescription.usernameToken) {
      await queryInterface.renameColumn('ConnectionInformations', 'usernameToken', 'emailToken');
    }
  },

  async down(queryInterface, Sequelize) {
    const conInfTableDescription = await queryInterface.describeTable('connectioninformations');
    if (conInfTableDescription.email) {
      await queryInterface.renameColumn('ConnectionInformations', 'email', 'username');
    }
    if (conInfTableDescription.emailToken) {
      await queryInterface.renameColumn('ConnectionInformations', 'emailToken', 'usernameToken');
    }
  },
};
