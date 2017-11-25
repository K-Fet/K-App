const winston = require('winston');
const serviceService = require('../services/service-service');
const Service = require('../models/service');

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

/**
 * Fetch all the services from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getServiceById(req, res) {
    try {
        const id = req.params.serviceId;
        const services = await serviceService.getServiceById(id);
        

        res.json(services);
    } catch (e) {
        winston.error('Error while getting service by Id', e);
        res.sendStatus(500);
    }

    return res.end();
}

/**
 * Fetch all the services from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteServiceById(req, res) {
    try {
        const id = req.params.serviceId;
        await serviceService.deleteServiceById(id);
        
    } catch (e) {
        winston.error('Error while delete service by Id', e);
        res.sendStatus(500);
    }

    return res.end();
}

/**
 * Fetch all the services from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function addService(req, res) {
    try {
        const newService = new Service();

        newService.name = req.body.name;
        newService.nbMax = req.body.nbMax;
        newService.categoryId = req.body.categoryId;

        newService.startingDate = req.body.startingDate;
        newService.finishDate =  req.body.finishDate;


        await serviceService.addService(newService);

    } catch (e) {
        winston.error('Error while adding a service', e);
        res.sendStatus(500);
    }

    return res.end();
}

/**
 * update a service by id in the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateServiceById(req, res) {
    try {
        const newService = new Service();

        newService.id = req.params.serviceId;
        newService.name = req.body.name;
        newService.nbMax = req.body.nbMax;
        newService.categoryId = req.body.categoryId;

        newService.startingDate = req.body.startingDate;
        newService.finishDate =  req.body.finishDate;


        await serviceService.updateServiceById(newService);
        
    } catch (e) {
        winston.error('Error while adding a service', e);
        res.sendStatus(500);
    }

    return res.end();
}


module.exports = {
    getAllServices,
    getServiceById,
    deleteServiceById,
    addService,
    updateServiceById
};
