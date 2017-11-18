const winston = require('winston');
const serviceService = require('../services/service-service');

/**
 * Fetch all the services from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllServices(req, res) {
    try {
        const services = await serviceService.getAllServices();

        res.json(services);
    } catch (e) {
        winston.error('Error while getting all services', e);
        res.sendStatus(500);
    }

    return res.end();
}

module.exports = {
    getAllServices,
};
