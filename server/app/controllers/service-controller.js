const Joi = require('joi');
const serviceService = require('../services/service-service');
const { Service } = require('../models/');
const { ServiceSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

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
    const schema = Joi.array().items(ServiceSchema.requiredKeys(
        'startingDate',
        'endingDate',
        'nbMax',
        '_embedded.category' // If _embedded exist, there must be a category field
    )).min(1);

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details.message);

    let newService = new Service({
        ...req.body,
        _embedded: undefined // Remove the only external object
    });

    newService = await serviceService.createService(newService, req.body._embedded);

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
    const schema = ServiceSchema.min(1);

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details.message);

    let newService = new Service({
        ...req.body,
        _embedded: undefined  // Remove the only external object
    });

    const serviceId = req.params.id;

    newService = await serviceService.updateService(serviceId, newService, req.body._embedded);

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
