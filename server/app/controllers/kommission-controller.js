const kommissionService = require('../services/kommission-service');
const { Kommission } = require('../models/kommission');
const { checkStructure, createUserError } = require('../../utils');

/**
 * Fetch all the kommissions from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllKommissions(req, res) {
    const kommissions = await kommissionService.getAllKommissions();

    res.json(kommissions);
}

/**
 * Create a kommission.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createKommission(req, res) {
    
    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'description'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'description\']'
        );
    }
    
    let newKommission = new Kommission({
        name: req.body.name,
        description: req.body.description,
    });
    
    newKommission = await kommissionService.createKommission(newKommission);
    
    res.json(newKommission);
}
    
    
/**
     * Get a kommission by its id.
     *
     * @param req Request
     * @param res Response
     * @return {Promise.<void>} Nothing
     */
async function getKommissionById(req, res) {
    const kommissionId = req.params.id;
    
    const kommission = await kommissionService.getKommissionById(kommissionId);
    
    res.json(kommission);
}
    
    
/**
     * Update a kommission.
     *
     * @param req Request
     * @param res Response
     * @return {Promise.<void>} Nothing
     */
async function updateKommission(req, res) {
    
    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'description'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'description\']'
        );
    }
    
    let newKommission = new Kommission({
        name: req.body.name,
        description: req.body.description,
    });
    
    const kommissionId = req.params.id;
    
    newKommission = await kommissionService.updateKommission(kommissionId, newKommission);
    
    res.json(newKommission);
}
    
/**
     * Delete a kommission.
     *
     * @param req Request
     * @param res Response
     * @return {Promise.<void>} Nothing
     */
async function deleteKommission(req, res) {
    const kommissionId = req.params.id;
    
    const kommission = await kommissionService.deleteKommission(kommissionId);
    
    res.json(kommission);
}

module.exports = {
    getAllKommissions,
    createKommission,
    updateKommission,
    getKommissionById,
    deleteKommission
};
