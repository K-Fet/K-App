const serviceService = require('../services/service-service');
const { Service } = require('../models/service');
const { checkStructure, createUserError } = require('../../utils');

/**
 * Fetch all the services from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllServices(req, res) {
    const services = await serviceService.getAllServices();

    res.json(services);
}

/**
 * Create a service.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createService(req, res) {

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'startAt', 'endAt', 'nbMax', 'category'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'startAt\', \'endAt\', \'nbMax\', \'category\']'
        );
    }

    let newService = new Service({
        name: req.body.name,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        nbMax: req.body.nbMax,
        category: req.body.category,
    });

    newService = await serviceService.createService(newService);

    res.json(newService);
}


/**
 * Get a service by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getServiceById(req, res) {
    const serviceId = req.params.id;

    const service = await serviceService.getServiceById(serviceId);

    res.json(service);
}


/**
 * Update a service.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateService(req, res) {

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['name', 'startAt', 'endAt', 'nbMax', 'category'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'name\', \'startAt\', \'endAt\', \'nbMax\', \'category\']'
        );
    }

    let newService = new Service({
        name: req.body.name,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        nbMax: req.body.nbMax,
        category: req.body.category,
    });

    const serviceId = req.params.id;

    newService = await serviceService.updateService(serviceId, newService);

    res.json(newService);
}

/**
 * Delete a service.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteService(req, res) {
    const serviceId = req.params.id;

    const service = await serviceService.deleteService(serviceId);

    res.json(service);
}


module.exports = {
    getAllServices,
    createService,
    updateService,
    getServiceById,
    deleteService
};