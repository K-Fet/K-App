const permissionService = require('../services/permission-service');

/**
 * Fetch all the permissions from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllPermissions(req, res) {
  const permissions = await permissionService.getAllPermissions();

  res.json(permissions);
}


module.exports = {
  getAllPermissions,
};
