const logger = require('../../logger');
const sequelize = require('../../db');
const { Role, Barman } = require('../models/');
const { createUserError, createServerError, cleanObject } = require('../../utils');

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
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Role|Errors.ValidationError>} The created role with its id
 */
async function createRole(newRole, _embedded) {

    logger.verbose('Role service: creating a new role named %s', newRole.name);

    const transaction = await sequelize.transaction();

    try {
        await newRole.save({transaction});
    } catch (err) {
        logger.warn('Role service: Error while creating role', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while creating role');
    }

    // Associations
    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            if (associationKey === 'barmen') {
                if (value.add && value.add.length > 0) {
                    try {
                        await newRole.addBarman(value.add, { transaction });
                    } catch (err) {
                        await transaction.rollback();
                        throw createUserError('UnknownBarman', 'Unable to associate roles with provided barmen');
                    }
                }
                if (value.remove && value.remove.length > 0) {
                    throw createUserError('RemovedValueProhibited', 'When creating a role, impossible to add removed value');
                }
            } else {
                throw createUserError('BadRequest', `Unknown association '${associationKey}', aborting!`);
            }
        }
    }

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
        include : [
            {
                model : Barman,
                as: 'barmen'
            }
        ]
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

    const currentRole = await Role.findById(roleId, {
        include: [
            {
                model : Barman,
                as: 'barmen'
            }
        ]
    });

    if (!currentRole) throw createUserError('UnknownRole', 'This role does not exist');

    logger.verbose('Role service: updating role named %s', currentRole.name);

    const transaction = await sequelize.transaction();

    try {
        await currentRole.update(cleanObject({
            name: updatedRole.name,
            description: updatedRole.description
        }), { transaction });

    } catch (err) {
        logger.warn('Role service: Error while updating role', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating role');
    }

    // Associations
    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            if (associationKey === 'barmen') {
                try {
                    if (value.add && value.add.length > 0) {
                        await currentRole.addBarman(value.add, { transaction });
                    }
                    if (value.remove && value.remove.length > 0) {
                        await currentRole.removeBarman(value.remove, { transaction });
                    }
                } catch (err) {
                    await transaction.rollback();
                    throw createUserError('UnknownBarman', 'Unable to associate role with provided barmen');
                }
            } else {
                await transaction.rollback();
                throw createUserError('BadRequest', `Unknown association '${associationKey}', aborting!`);
            }
        }
    }
    await transaction.commit();
    return currentRole;
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
