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

module.exports = {
    getAllServices
};