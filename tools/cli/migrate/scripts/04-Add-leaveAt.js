/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    const barmans = await queryInterface.describeTable('Barmans');
    if (!barmans.leaveAt) {
      await queryInterface.addColumn('Barmans', 'leaveAt', Sequelize.DATEONLY);
    }
    if (barmans.active) {
      await queryInterface.removeColumn('Barmans', 'active');
    }
  },

  async down(queryInterface, Sequelize) {
    const barmans = await queryInterface.describeTable('Barmans');
    if (barmans.leaveAt) {
      await queryInterface.removeColumn('Barmans', 'leaveAt');
    }
    if (!barmans.active) {
      await queryInterface.addColumn('Barmans', 'active', Sequelize.BOOLEAN, {
        allowNull: false,
        default: true,
      });
    }
  },
};
