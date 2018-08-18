const Joi = require('joi');
const barmanService = require('../services/barman-service');
const { Barman, ConnectionInformation } = require('../models');
const { BarmanSchema } = require('../models/schemas');
const { createUserError, parseStartAndEnd } = require('../../utils');

/**
 * Fetch all the barmen from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllBarmen(req, res) {
  const barmen = await barmanService.getAllBarmen();

  res.json(barmen);
}

/**
 * Create a Barman
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createBarman(req, res) {
  const newUser = req.body;

  let newBarman = new Barman(
    {
      ...newUser,
      _embedded: undefined, // Remove the only external object
    },
    {
      include: [
        {
          model: ConnectionInformation,
          as: 'connection',
        },
      ],
    },
  );

  newBarman = await barmanService.createBarman(newBarman, newUser._embedded);

  res.json(newBarman);
}

/**
 * Get a barman by his id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getBarmanById(req, res) {
  const barmanId = req.params.id;

  const barman = await barmanService.getBarmanById(barmanId);

  res.json(barman);
}

/**
 * Update a barman.
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateBarman(req, res) {
  let newBarman = new Barman(
    {
      ...req.body,
      _embedded: undefined, // Remove the only external object
    },
    {
      include: [
        {
          model: ConnectionInformation,
          as: 'connection',
        },
      ],
    },
  );

  const barmanId = req.params.id;

  newBarman = await barmanService.updateBarmanById(barmanId, newBarman, newUser._embedded);

  res.json(newBarman);
}

/**
 * Delete a barman

 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteBarman(req, res) {
  const barmanId = req.params.id;

  const barman = await barmanService.deleteBarmanById(barmanId);

  res.json(barman);
}

/**
 * Get the services of a barman
 *
 * @param req Request
 * @param res Response
 * @returns {Promise<void>} Nothing
 */
async function getServicesBarman(req, res) {
  const barmanId = req.params.id;

  const { startAt, endAt } = req.query;
  const services = await barmanService.getBarmanServices(barmanId, startAt, endAt);

  res.json(services);
}

/**
 * Create a Service
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createServiceBarman(req, res) {
  const barmanId = req.params.id;
  const servicesId = req.body;

  await barmanService.createServiceBarman(barmanId, servicesId);

  res.send();
}

/**
 * Delete a Service of a barman
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteServiceBarman(req, res) {
  const barmanId = req.params.id;
  const servicesId = req.body;

  await barmanService.deleteServiceBarman(barmanId, servicesId);

  res.send();
}

module.exports = {
  getAllBarmen,
  createBarman,
  getBarmanById,
  updateBarman,
  deleteBarman,
  getServicesBarman,
  createServiceBarman,
  deleteServiceBarman,
};
