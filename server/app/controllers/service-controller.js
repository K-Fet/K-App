const serviceService = require('../services/service-service');
const { Service } = require('../models/');

/**
 * Fetch all the services from the database. Include associated barmen.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllServices(req, res) {
  const { startAt, endAt } = req.query;
  const services = await serviceService.getAllServices(startAt, endAt);

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
  let newService = new Service({
    ...req.body,
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
