const logger = require('../../logger');
const { sequelize } = require('../../bootstrap/sequelize');
const { Role, Barman, Permission } = require('../models/');
const {
  createUserError, createServerError, cleanObject, setAssociations,
} = require('../../utils');

/**
 * Return all roles of the app.
 *
 * @returns {Promise<Array>} Roles
 */
async function getAllRoles() {
  logger.verbose('Role service: get all roles');
  return Role.findAll({
    order: [
      ['name', 'ASC'],
    ],
  });
}

/**
 * Create a role.
 *
 * @param newRole {Role} partial role
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Role|Errors.ValidationError>} The created role with its id
 */
async function createRole(newRole, _embedded) {
  logger.verbose('Role service: creating a new role named %s', newRole.name);

  const transaction = await sequelize().transaction();

  try {
    await newRole.save({ transaction });
  } catch (err) {
    logger.warn('Role service: Error while creating role', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while creating role');
  }

  // Associations
  await setAssociations(_embedded, newRole, null, transaction, true);

  await transaction.commit();
  return newRole;
}

/**
 * Get a role by its id.
 *
 * @param roleId {number} Role id
 * @return {Promise<Role>} The wanted role.
 */
async function getRoleById(roleId) {
  logger.verbose('Role service: get role by id %d', roleId);

  const role = await Role.findById(roleId, {
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
      {
        model: Permission,
        as: 'permissions',
      },
    ],
  });

  if (!role) throw createUserError('UnknownRole', 'This role does not exist');

  return role;
}

/**
 * Update a role.
 * This will copy only the allowed changes from the `updatedRole`
 * into the current role.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param roleId {number} role id
 * @param updatedRole {Role} Updated role, constructed from the request.
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Role>} The updated role
 */
async function updateRole(roleId, updatedRole, _embedded) {
  const currentRole = await Role.findById(roleId);

  if (!currentRole) throw createUserError('UnknownRole', 'This role does not exist');

  logger.verbose('Role service: updating role named %s', currentRole.name);

  const transaction = await sequelize().transaction();

  try {
    await currentRole.update(cleanObject({
      name: updatedRole.name,
      description: updatedRole.description,
    }), { transaction });
  } catch (err) {
    logger.warn('Role service: Error while updating role', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while updating role');
  }

  // Associations
  await setAssociations(_embedded, currentRole, null, transaction);

  await transaction.commit();
  return currentRole.reload();
}

/**
 * Delete a role.
 *
 * @param roleId {number} role id.
 * @return {Promise<Role>} The deleted role
 */
async function deleteRole(roleId) {
  logger.verbose('Role service: deleting role with id %d', roleId);

  const role = await Role.findById(roleId);

  if (!role) throw createUserError('UnknownRole', 'This role does not exist');

  await role.destroy();

  return role;
}

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  getRoleById,
  deleteRole,
};
