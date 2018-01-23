const roleService = require('../services/role-service');
const { Role } = require('../models/role');
const { checkStructure, createUserError } = require('../../utils');

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

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'description'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'description\']'
        );
    }

    let newRole = new Role({
        name: req.body.name,
        description: req.body.description,
    });

    newRole = await roleService.createRole(newRole);

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

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'description'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'description\']'
        );
    }

    let newRole = new Role({
        name: req.body.name,
        description: req.body.description,
    });

    const roleId = req.params.id;

    newRole = await roleService.updateRole(roleId, newRole);

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
    deleteRole
};
