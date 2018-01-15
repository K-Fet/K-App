const logger = require('../../logger');
const { Barman } = require('../models/barman');
const { createUserError } = require('../../utils');

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getAllBarmen() {

    logger.verbose('Barman service: get all barmen');
    return await Barman.findAll();
}

/**
 * Create a Barman.
 *
 * @param newBarman {Barman} partial member
 * @return {Promise<Barman|Errors.ValidationError>} The created barman with its id
 */
async function createBarman(newBarman) {

    logger.verbose('Barman service: creating a new barman named %s %s', newBarman.firstName, newBarman.lastName);
    return await newBarman.save();
}

/**
 * Get a Barman by his id.
 * @param barmanId {number} Barman Id
 * @returns {Promise<Barman>} Barmen
 */
async function getBarmanById(barmanId) {

    logger.verbose('Barman service: get a barman by his id %d', barmanId);

    const barman = await Barman.findById(barmanId);

    if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

    return await barman;
}

/**
 * Update a barman
 * This will copy only the allowed changes from the `updatedBarman`
 * into the current barman.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param barmanId {number} barman id
 * @param updatedBarman {Barman} Updated barman, constructed from the request.
 * @return {Promise<Barman>} The updated barman
 */
async function updateBarmanById(barmanId, updatedBarman) {
    const currentBarman = await Barman.findById(barmanId);
    
    if (!currentBarman) throw createUserError('UnknownBarman', 'This Barman does not exist');

    logger.verbose('Barman service: updating barman named %s %s', currentBarman.firstName, currentBarman.lastName);

    return await currentBarman.update({
        firstName: updatedBarman.firstName,
        lastName: updatedBarman.lastName,
        nickname: updatedBarman.nickname,
        facebook: updatedBarman.facebook,
        godFather: updatedBarman.godFather,
        dateOfBirth: updatedBarman.dateOfBirth,
        flow: updatedBarman.flow,
        active: updatedBarman.active
    });
}

/**
 * Delete a Barman.
 *
 * @param barmanId {number} barman id
 * @returns {Promise<Barman>} The deleted barman
 */
async function deleteBarmanById(barmanId) {

    logger.verbose('Barman service: deleting member with id %d', barmanId);

    const barman = await Barman.findById(barmanId);

    if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

    await barman.destroy();

    return barman;
}

module.exports = {
    getAllBarmen,
    createBarman,
    getBarmanById,
    deleteBarmanById,
    updateBarmanById,
};
