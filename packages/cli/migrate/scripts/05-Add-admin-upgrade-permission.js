/* eslint-disable require-jsdoc,no-unused-vars */
const { ADMIN_UPGRADE_PERMISSION } = require('k-app-server/moleculer-app/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Shortcut
    const query = queryInterface.sequelize.query.bind(queryInterface.sequelize);
    const params = { type: Sequelize.QueryTypes.SELECT };

    const [upgradePerm] = await query(`SELECT * FROM permissions WHERE name='${ADMIN_UPGRADE_PERMISSION}'`, params);

    if (!upgradePerm) {
      await query(`INSERT INTO permissions (name) VALUES ('${ADMIN_UPGRADE_PERMISSION}')`);
    }
    // Get upgrade permId
    const [{ id: permId }] = await query(`SELECT id FROM permissions WHERE name='${ADMIN_UPGRADE_PERMISSION}'`, params);

    // List every other permissions (used to find supposed admin)
    const perms = await query(`SELECT id FROM permissions WHERE name!='${ADMIN_UPGRADE_PERMISSION}'`, params);

    // Get the special account who has already every permissions
    const [adminAccount] = await query(
      `SELECT SpecialAccountId
        FROM specialaccountpermissions
        WHERE PermissionId IN (${perms.map(p => p.id).join(',')})
        GROUP BY SpecialAccountId
        HAVING COUNT(*) = ${perms.length}`,
      params,
    );

    if (!adminAccount) {
      console.error('Unable to find an admin during migration or he already have the upgrade permission.');
      console.error('If it\'s not the case, you should do it manually');
      return;
    }

    await query(`INSERT INTO specialaccountpermissions VALUE (now(), now(), ${adminAccount.SpecialAccountId}, ${permId})`);
  },

  async down(queryInterface, Sequelize) {
    // Nothing needed, will just not use the admin upgrade permission
  },
};
