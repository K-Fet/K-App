const dotenv = require('dotenv');
const { Barman } = require('../../../../server/app/models');
const sequelize = require('../../../../server/bootstrap/sequelize');
const config = require('../../../../server/bootstrap/config');

async function init() {
  dotenv.config();
  config.start();
  await sequelize.start();
}

async function setLeaveAtForOldBarmen() {
  const oldBarmen = await Barman.findAll({
    where: {
      active: false,
    },
  });
  const promises = [];
  oldBarmen.forEach((oldBarman) => {
    const newOldBarman = oldBarman;
    newOldBarman.leaveAt = new Date('2018-07-31');
    promises.push(newOldBarman.save());
  });
  await Promise.all(promises);
}

async function setActiveForBarmen() {
  const barmen = await Barman.findAll();
  const promises = [];
  barmen.forEach((barman) => {
    const newBarman = barman;
    newBarman.active = !barman.leaveAt;
    promises.push(newBarman.save());
  });
  await Promise.all(promises);
}

/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    const barmans = await queryInterface.describeTable('barmans');
    await init();
    if (!barmans.leaveAt) {
      await queryInterface.addColumn('barmans', 'leaveAt', Sequelize.DATEONLY);
      await setLeaveAtForOldBarmen();
    }
    if (barmans.active) {
      await queryInterface.removeColumn('barmans', 'active');
    }
  },

  async down(queryInterface, Sequelize) {
    const barmans = await queryInterface.describeTable('barmans');
    await init();
    if (!barmans.active) {
      await queryInterface.addColumn('barmans', 'active', Sequelize.BOOLEAN, {
        allowNull: false,
        default: true,
      });
      await setActiveForBarmen();
    }
    if (barmans.leaveAt) {
      await queryInterface.removeColumn('barmans', 'leaveAt');
    }
  },
};
