const { PERMISSION_LIST } = require('../config/permissions');
const { Permission } = require('../app/models');
const logger = require('../logger');

/**
 * This function will synchronise permissions from PERMISSION_LIST with database.
 *
 * Permissions are special as they are both static and dynamic:
 * They are checked in routes statically and must be linked to roles
 * or a special account dynamically.
 *
 * @return {Promise<void>} Nothing
 */
async function start() {
  logger.info('Syncing permissions: starting...');
  const currPerms = (await Permission.findAll()).map(p => p.name);

  const toCreate = PERMISSION_LIST
    .filter(p => !currPerms.includes(p))
    .map(p => ({ name: p }));

  await Permission.bulkCreate(toCreate);

  logger.info('Syncing permissions: done.');
}


module.exports = {
  start,
};
