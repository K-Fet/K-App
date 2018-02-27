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

    let start;
    let end;

    if (req.query.start && req.query.end) {
        // The transformation of the DATE in ISO format is in UTC hence we add one hour to correspond to UTC+1
        // I use a + to convert the param from string to int
        start = new Date(+req.query.start + (1 * 60 * 60 * 1000));
        end = new Date(+req.query.end + (1 * 60 * 60 * 1000));
        start = start.toISOString();
        end = end.toISOString();
    } else {
        throw createUserError('BadRequest', '\'start\' & \'end\' query parameters are required');
    }

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
        'nbMax',
        '_embedded.category' // If _embedded exist, there must be a category field
    )).min(1);
    

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details[0].message);

    //créer un tableau de services , a la place de new service etc.... (foreach...)
    const services = new Array();

    /* req.body.forEach(service => {
        service = await serviceService.createService(service, service[_embedded]);
        services.push(service);
    });*/

    for(let service of req.body) {
        let newService = new Service({
            name: service.name,
            startAt: service.startAt,
            endAt: service.endAt,
            nbMax: service.nbMax
        });
        service = await serviceService.createService(newService, service._embedded);
        services.push(service);
    }

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
