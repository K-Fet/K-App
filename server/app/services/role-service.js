const logger = require('../../logger');
const { Role: Role } = require('../models/role');
const { createUserError } = require('../../utils');

/**
 * Return all roles of the app.
 *
 * @returns {Promise<Array>} Roles
 */
async function getAllRoles() {

    logger.verbose('Role service: get all roles');
    return await Role.findAll();
}

/**
 * Create a role.
 *
 * @param newRole {Role} partial role
 * @return {Promise<Role|Errors.ValidationError>} The created role with its id
 */
async function createRole(newRole) {

    logger.verbose('Role service: creating a new role named %s', newRole.name);
    return await newRole.save();
}


/**
 * Get a role by its id.
 *
 * @param roleId {number} Role id
 * @return {Promise<Role>} The wanted role.
 */
async function getRoleById(roleId) {

    logger.verbose('Role service: get role by id %d', roleId);

    const role = await Role.findById(roleId);

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
 * @return {Promise<Role>} The updated role
 */
async function updateRole(roleId, updatedRole) {

    const currentRole = await Role.findById(roleId);

    if (!currentRole) throw createUserError('UnknownRole', 'This role does not exist');

    logger.verbose('Role service: updating role named %s', currentRole.name);

    return await currentRole.update({
        name: updatedRole.name,
        description: updatedRole.description,
    });
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
    deleteRole
};
