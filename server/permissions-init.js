const { PERMISSION_LIST } = require('./config/permissions');
const { Permission } = require('./app/models');

/**
 * This function will synchronise permissions from PERMISSION_LIST with database.
 *
 * Permissions are special as they are both static and dynamic:
 * They are checked in routes statically and must be linked to roles
 * or a special account dynamically.
 *
 * @return {Promise<void>} Nothing
 */
async function syncPermissions() {
    return Promise.all(PERMISSION_LIST.map(perm =>
        Permission.findOrCreate({ where: { name: perm } })));
}


module.exports = {
    syncPermissions,
};
