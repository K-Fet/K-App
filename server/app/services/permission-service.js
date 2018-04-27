const logger = require('../../logger');
const { Permission } = require('../models');
const { createPermissionError } = require('../../utils');
const { Op } = require('sequelize');

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

    if (wantedPerms.add) {
        const perms = await Permission.findAll({
            where: {
                id: {
                    [Op.in]: wantedPerms.add,
                },
            },
        });

        if (perms.length !== wantedPerms.add.length) throw createPermissionError();

        for (const p of perms) {
            if (userPerms.includes(p.name)) throw createPermissionError();
        }
    }

    if (wantedPerms.remove) {
        const perms = await Permission.findAll({
            where: {
                id: {
                    [Op.in]: wantedPerms.remove,
                },
            },
        });

        if (perms.length !== wantedPerms.remove.length) throw createPermissionError();

        for (const p of perms) {
            if (userPerms.includes(p.name)) throw createPermissionError();
        }
    }
}


module.exports = {
    getAllPermissions,
    hasEnoughPermissions,
};
