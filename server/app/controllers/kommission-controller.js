const kommissionService = require('../services/kommission-service');
const { Kommission } = require('../models');
const { KommissionSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

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
    const schema = KommissionSchema.requiredKeys(
        'name',
        'description'
    );

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details.message);


    let newKommission = new Kommission({
        ...req.body,
        _embedded: undefined // Remove the only external object
    });

    newKommission = await kommissionService.createKommission(newKommission, req.body._embedded);

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
    const schema = KommissionSchema.min(1);

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details.message);

    let newKommission = new Kommission({
        ...req.body,
        _embedded: undefined // Remove the only external object
    });

    const kommissionId = req.params.id;

    newKommission = await kommissionService.updateKommission(kommissionId, newKommission, req.body._embedded);

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
