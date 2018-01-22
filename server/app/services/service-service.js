const logger = require('../../logger');
const { Service: Service } = require('../models/service');
const { createUserError } = require('../../utils');

/**
 * Return all services of the app.
 *
 * @returns {Promise<Array>} Services
 */
async function getAllServices() {

    logger.verbose('Service service: get all services');
    return await Service.findAll();
}

/**
 * Create a service.
 *
 * @param newService {Service} partial service
 * @return {Promise<Service|Errors.ValidationError>} The created service with its id
 */
async function createService(newService) {

    logger.verbose('Service service: creating a new service named %s', newService.name);
    return await newService.save();
}


/**
 * Get a service by its id.
 *
 * @param serviceId {number} Service id
 * @return {Promise<Service>} The wanted service.
 */
async function getServiceById(serviceId) {

    logger.verbose('Service service: get service by id %d', serviceId);

    const service = await Service.findById(serviceId);

    if (!service) throw createUserError('UnknownService', 'This service does not exist');

    return service;
}


/**
 * Update a service.
 * This will copy only the allowed changes from the `updatedService`
 * into the current service.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param serviceId {number} service id
 * @param updatedService {Service} Updated service, constructed from the request.
 * @return {Promise<Service>} The updated service
 */
async function updateService(serviceId, updatedService) {

    const currentService = await Service.findById(serviceId);

    if (!currentService) throw createUserError('UnknownService', 'This service does not exist');

    logger.verbose('Service service: updating service named %s', currentService.name);

    return await currentService.update({
        name: updatedService.name,
        startAt: updatedService.startAt,
        endAt: updatedService.endAt,
        nbMax: updatedService.nbMax,
        category: updatedService.category
    });
}

/**
 * Delete a service.
 *
 * @param serviceId {number} service id.
 * @return {Promise<Service>} The deleted service
 */
async function deleteService(serviceId) {

    logger.verbose('Service service: deleting service with id %d', serviceId);

    const service = await Service.findById(serviceId);

    if (!service) throw createUserError('UnknownService', 'This service does not exist');

    await service.destroy();

    return service;
}


module.exports = {
    getAllServices,
    createService,
    updateService,
    getServiceById,
    deleteService
};