const winston = require('winston');
const ServiceDAO = require('../dao/service-dao');

const serviceDAO = new ServiceDAO();

/**
 * Return all services of the app.
 *
 * @returns {Promise<Array>} Services
 */
async function getAllServices() {
    await serviceDAO.init();

    winston.info('Services service: get all services');
    const services = await serviceDAO.findAll();

    serviceDAO.end();
    return services;
}

/**
 * Return service of the app By Id
 * 
 * @param id {Number} Integer id of a service
 * @returns {Promise<Array>} Services
 */
async function getServiceById(id) {
    await serviceDAO.init();

    winston.info('Services service: get service by Id');
    const services = await serviceDAO.findById(id);

    serviceDAO.end();
    return services;
}

/**
 * Delete service by Id
 * 
 * @param id {Number} Integer id of a service
 * @returns {Promise<Array>} Services
 */
async function deleteServiceById(id) {
    await serviceDAO.init();

    winston.info('Services service: delete service by Id');
    await serviceDAO.deleteServiceById(id);

    serviceDAO.end();
}

/**
 * Return service of the app By Id
 * 
 * @param newService {Service} Service 
 * @returns {Promise<Array>} Services
 */
async function addService(newService) {
    await serviceDAO.init();

    winston.info('Services service: add Service');
    const services = await serviceDAO.addService(newService);

    serviceDAO.end();
    return services;
}

/**
 * Return service of the app By Id
 * 
 * @param newService {Service} Service 
 * @returns {Promise<Array>} Services
 */
async function updateServiceById(newService) {
    console.log('entre dans addService service');
    await serviceDAO.init();

    winston.info('Services service: update Service');
    const services = await serviceDAO.updateServiceById(newService);

    serviceDAO.end();
    return services;
}


/**
 * Return service of the app By Id
 * 
 * @param id {Number} Integer id of a service
 * @returns {Promise<Array>} Services
 */
async function getBarmenByServiceId(id) {
    await serviceDAO.init();

    winston.info('Services service: get Barmen by service Id');
    const barmen = await serviceDAO.getBarmenByServiceId(id);

    serviceDAO.end();
    return barmen;
}

module.exports = {
    getAllServices,
    getServiceById,
    deleteServiceById,
    addService,
    updateServiceById,
    getBarmenByServiceId
};
