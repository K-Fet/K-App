/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    const barmans = await queryInterface.describeTable('barmans');
    if (!barmans.leaveAt) {
      await queryInterface.addColumn('barmans', 'leaveAt', Sequelize.DATEONLY);
      await queryInterface.sequelize.query('UPDATE `barmans` SET `leaveAt`="2018-07-31" WHERE `active`=false OR active IS NULL;');
    }
    if (barmans.active) {
      await queryInterface.removeColumn('barmans', 'active');
    }
  },

  async down(queryInterface, Sequelize) {
    const barmans = await queryInterface.describeTable('barmans');
    if (!barmans.active) {
      await queryInterface.addColumn('barmans', 'active', Sequelize.BOOLEAN, {
        allowNull: false,
        default: true,
      });
      await queryInterface.sequelize.query('UPDATE `barmans` SET `active`="false" WHERE `leaveAt` IS NOT NULL;');
      await queryInterface.sequelize.query('UPDATE `barmans` SET `active`="true" WHERE `leaveAt` IS NULL;');
    }
    if (barmans.leaveAt) {
      await queryInterface.removeColumn('barmans', 'leaveAt');
    }
  },
};
