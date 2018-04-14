const serviceService = require('../services/service-service');
const { Service } = require('../models/');
const { ServiceSchema } = require('../models/schemas');
const { createUserError, parseStartAndEnd } = require('../../utils');
const Joi = require('joi');

/**
 * Fetch all the services from the database. Include associated barmen.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllServices(req, res) {

    const { start, end } = parseStartAndEnd(req.query);
    const services = await serviceService.getAllServices(start, end);

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
        'startAt',
        'endAt',
        'nbMax'
    )).min(1);

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    const services = await serviceService.createService(req.body);

    return res.json(services);
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
    if (error) throw createUserError('BadRequest', error.message);
    let newService = new Service({
        ...req.body
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
    deleteService,
};
