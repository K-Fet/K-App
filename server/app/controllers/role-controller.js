const roleService = require('../services/role-service');
const permissionService = require('../services/permission-service');
const { Role } = require('../models');
const { RoleSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

/**
 * Fetch all the roles from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllRoles(req, res) {
  const roles = await roleService.getAllRoles();

  res.json(roles);
}

/**
 * Create a role.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createRole(req, res) {
  const schema = RoleSchema.requiredKeys(
    'name',
    'description',
  );

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);


  let newRole = new Role({
    ...req.body,
    _embedded: undefined, // Remove the only external object
  });


  if (req.body._embedded) {
    await permissionService.hasEnoughPermissions(req.user.permissions, req.body._embedded.permissions);
  }

  newRole = await roleService.createRole(newRole, req.body._embedded);

  res.json(newRole);
}


/**
 * Get a role by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getRoleById(req, res) {
  const roleId = req.params.id;

  const role = await roleService.getRoleById(roleId);

  res.json(role);
}


/**
 * Update a role.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateRole(req, res) {
  const schema = RoleSchema.min(1);

  const { error } = schema.validate(req.body);
  if (error) throw createUserError('BadRequest', error.message);


  let newRole = new Role({
    ...req.body,
    _embedded: undefined, // Remove the only external object
  });

  const roleId = req.params.id;


  if (req.body._embedded) {
    await permissionService.hasEnoughPermissions(req.user.permissions, req.body._embedded.permissions);
  }

  newRole = await roleService.updateRole(roleId, newRole, req.body._embedded);

  res.json(newRole);
}

/**
 * Delete a role.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteRole(req, res) {
  const roleId = req.params.id;

  const role = await roleService.deleteRole(roleId);

  res.json(role);
}


module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  getRoleById,
  deleteRole,
};
