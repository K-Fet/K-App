const logger = require('../../logger');
const { Permission } = require('../models');

/**
 * Return all permissions of the app.
 *
 * @returns {Promise<Array>} Permissions
 */
async function getAllPermissions() {

    logger.verbose('Permission service: get all permissions');
    return Permission.findAll();
}


module.exports = {
    getAllPermissions,
};
