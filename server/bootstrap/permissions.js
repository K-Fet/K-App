const { PERMISSION_LIST, ADMIN_UPGRADE_PERMISSION } = require('../app/constants');
const { Permission, SpecialAccount } = require('../app/models');
const logger = require('../logger');

/**
 * This function will synchronise permissions from PERMISSION_LIST with database.
 * For now, it will not delete permissions that does no longer exists.
 *
 * @return {Promise<void>}
 */
async function updatePermissions() {
  const currPerms = (await Permission.findAll()).map(p => p.name);

  const toCreate = PERMISSION_LIST
    .filter(p => !currPerms.includes(p))
    .map(p => ({ name: p }));

  await Permission.bulkCreate(toCreate);
}

async function upgradeAdminPermissions() {
  const perms = await Permission.findAll();

  const admins = await SpecialAccount.findAll({
    include: [
      {
        model: Permission,
        as: 'permissions',
        where: { name: ADMIN_UPGRADE_PERMISSION },
      },
    ],
  });

  if (admins.length === 0) {
    throw new Error(`Unable to find the admin (with the '${ADMIN_UPGRADE_PERMISSION}' permission).`);
  }
  if (admins.length > 1) {
    throw new Error('There is more than one admin currently... Please, let only one admin');
  }

  const [admin] = admins;

  await admin.setPermissions(perms);
}

/**
 * This function update permissions of the database with existing ones.
 *
 * @return {Promise<void>} Nothing
 */
async function start() {
  logger.info('Syncing permissions: starting...');
  await updatePermissions();
  logger.info('Syncing permissions: done.');
  logger.info('Syncing admin permissions: starting...');
  await upgradeAdminPermissions();
  logger.info('Syncing admin permissions: done.');
}


module.exports = {
  start,
};
