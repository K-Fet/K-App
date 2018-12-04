const { Op } = require('sequelize');
const logger = require('../../logger');
const { Permission } = require('../models');
const { ADMIN_UPGRADE_PERMISSION } = require('../constants');
const { createPermissionError, createUserError } = require('../../utils');

/**
 * Return all permissions of the app.
 *
 * @returns {Promise<Array>} Permissions
 */
async function getAllPermissions() {
  logger.verbose('Permission service: get all permissions');
  return Permission.findAll();
}


/**
 * This function check if an user doesn't set permissions he doesn't have.
 *
 * Will throw an user error if not enough permissions, nothing otherwise.
 *
 * @param userPerms {Array<String>} Permissions list (by name)
 * @param wantedPerms An object with two arrays `add` & `remove` with id in it.
 * @return {Promise<void>} Nothing
 */
async function hasEnoughPermissions(userPerms, wantedPerms) {
  if (!wantedPerms) return;

  const editedPerms = [...new Set([...wantedPerms.add, ...wantedPerms.remove])];

  const perms = await Permission.findAll({
    where: {
      id: {
        [Op.in]: editedPerms,
      },
    },
  });

  // If there is a unknown permission throw
  if (perms.length !== editedPerms.length) throw createPermissionError();

  // Checking if there is anything related to the admin upgrade permission
  // and throw error in this case. This permission shouldn't be change in any
  // circumstance.
  const upgradePerm = perms.find(p => ADMIN_UPGRADE_PERMISSION === p.name);
  if (upgradePerm) throw createUserError(`You can't update the ${ADMIN_UPGRADE_PERMISSION} permission. Please contact the administrator.`);

  // Check if the user doing the action actually have the permissions he tries to add/remove
  const res = perms.find(p => !userPerms.includes(p.name));

  if (res) throw createPermissionError();
}


module.exports = {
  getAllPermissions,
  hasEnoughPermissions,
};
