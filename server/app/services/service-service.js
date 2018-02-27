const logger = require('../../logger');
const sequelize = require('../../db');
const Op = sequelize.Op;
const { Service, Category } = require('../models');
const { createUserError, createServerError, cleanObject } = require('../../utils');



/**
 * Return all services of the app.
 *
 * @returns {Promise<Array>} Services
 */
async function getAllServices(start, end) {

    logger.verbose('Service service: get all services');
    return await Service.findAll({
        where: {
            startAt : { 
                [Op.gte]: start,
            }, endAt : { 
                [Op.lte]: end
            }
        }
    });
}

/**
 * Create a service.
 *
 * @param newService {Service} partial service
 * @return {Promise<Service|Errors.ValidationError>} The created service with its id
 */
async function createService(newService, _embedded) {

    logger.verbose('Service service: creating a new service named %s', newService.name);

    const transaction = await sequelize.transaction();
    try {
        await newService.save({ transaction });

    }catch (err) {
        logger.warn('Service service: Error while creating service', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while creating service');
    }

    // Associations
    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            if (associationKey === 'category') {
                const wantedCategory = await Category.findById(value);

                if (!wantedCategory) {
                    await transaction.rollback();
                    throw createUserError('UnknownCategory', `Unable to find category with id ${wantedCategory}`);
                }

                await newService.setCategory(wantedCategory, { transaction });

            } else {
                throw createUserError('BadRequest', `Unknown association '${associationKey}', aborting!`);
            }
        }
    }
    await transaction.commit();
    return newService;
}

/**
 * Get a service by its id.
 *
 * @param serviceId {number} Service id
 * @return {Promise<Service>} The wanted service.
 */
async function getServiceById(serviceId) {

    logger.verbose('Service service: get service by id %d', serviceId);

    const service = await Service.findById(serviceId, {
        include: [
            {
                model: Category,
            },
        ]
    });

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
async function updateService(serviceId, updatedService, _embedded) {
    let currentService = await Service.findById(serviceId, {
        include: [
            {
                model: Category,
            },
        ]
    });

    if (!currentService) throw createUserError('UnknownService', 'This Service does not exist');

    logger.verbose('Service service: updating service named %s', currentService.name);

    const transaction = await sequelize.transaction();

    try {
        await currentService.update(cleanObject({
            name: updatedService.name,
            startAt: updatedService.startAt,
            endAt: updatedService.endAt,
            nbMax: updatedService.nbMax,    
        }), { transaction });

    } catch (err) {
        logger.warn('Service service: Error while updating service', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating service');
    }

    // Associations
    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            if (associationKey === 'category') {
                const wantedCategory = await Category.findById(value);

                if (!wantedCategory) {
                    await transaction.rollback();
                    throw createUserError('UnknownService', `Unable to find category with id ${value}`);
                }
                await currentService.setCategory(wantedCategory, { transaction });
            } else {
                await transaction.rollback();
                throw createUserError('BadRequest', `Unknown association '${associationKey}', aborting!`);
            }
        }
    }
    await transaction.commit();

    currentService = await Service.findById(serviceId, {
        include: [
            {
                model: Category,
            },
        ]
    });

    return currentService;
}


/**
 * Delete a service.
 *
 * @param serviceId {number} service id.
 * @return {Promise<Service>} The deleted service
 */
async function deleteService(serviceId) {

    logger.verbose('Service service: deleting service with id %d', serviceId);

    const service = await Service.findById(serviceId, {
        
        include: [
            {
                model: Category
            }
        ]});

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
