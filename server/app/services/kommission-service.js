const logger = require('../../logger');
const { Kommission: Kommission } = require('../models/kommission');
const { createUserError } = require('../../utils');

/**
 * Return all kommissions of the app.
 *
 * @returns {Promise<Array>} Kommissions
 */
async function getAllKommissions() {

    logger.verbose('Kommission service: get all kommissions');
    return await Kommission.findAll();
}


/**
 * Create a kommission.
 *
 * @param newKommission {Kommission} partial kommission
 * @return {Promise<Kommission|Errors.ValidationError>} The created kommission with its id
 */
async function createKommission(newKommission) {
    
    logger.verbose('Kommission service: creating a new kommission named %s %s', newKommission.firstName, newKommission.lastName);
    return await newKommission.save();
}
    

/**
     * Get a kommission by its id.
     *
     * @param kommissionId {number} Kommission id
     * @return {Promise<Kommission>} The wanted kommission.
     */
async function getKommissionById(kommissionId) {
    
    logger.verbose('Kommission service: get kommission by id %d', kommissionId);
    
    const kommission = await Kommission.findById(kommissionId);
    
    if (!kommission) throw createUserError('UnknownKommission', 'This kommission does not exist');
    
    return kommission;
}
    
    
/**
     * Update an kommission.
     * This will copy only the allowed changes from the `updatedKommission`
     * into the current kommission.
     * This means, with this function, you can not change everything like
     * the `createdAt` field or others.
     *
     * @param kommissionId {number} kommission id
     * @param updatedKommission {Kommission} Updated kommission, constructed from the request.
     * @return {Promise<Kommission>} The updated kommission
     */
async function updateKommission(kommissionId, updatedKommission) {
    
    const currentKommission = await Kommission.findById(kommissionId);
    
    if (!currentKommission) throw createUserError('UnknownKommission', 'This kommission does not exist');
    
    logger.verbose('Kommission service: updating kommission named %s %s', currentKommission.firstName, currentKommission.lastName);
    
    return await currentKommission.update({
        id: updatedKommission.id,
        name: updatedKommission.name,
        description: updatedKommission.description,
            
    });
}
    
/**
     * Delete an kommission.
     *
     * @param kommissionId {number} kommission id.
     * @return {Promise<Kommission>} The deleted kommission
     */
async function deleteKommission(kommissionId) {
    
    logger.verbose('Kommission service: deleting kommission with id %d', kommissionId);
    
    const kommission = await Kommission.findById(kommissionId);
    
    if (!kommission) throw createUserError('UnknownKommission', 'This kommission does not exist');
    
    await kommission.destroy();
    
    return kommission;
}
    

module.exports = {
    getAllKommissions,
    createKommission,
    updateKommission,
    getKommissionById,
    deleteKommission
};
