const kommissionService = require('../services/kommission-service');
const { Barman, Kommission } = require('../models');

/**
 * Fetch all the kommissions from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllKommissions(req, res) {
  const kommissions = await kommissionService.getAllKommissions();

  res.json(kommissions);
}

/**
 * Get the tasks of a kommission
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getTasks(req, res) {
  const kommissionId = req.params.id;

  const kommission = await kommissionService.getKommissionById(kommissionId);

  res.json(await kommission.getTasks({
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
    ],
  }));
}

/**
 * Create a kommission.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createKommission(req, res) {
  let newKommission = new Kommission({
    ...req.body,
    _embedded: undefined, // Remove the only external object
  });

  newKommission = await kommissionService.createKommission(newKommission, req.body._embedded);

  res.json(newKommission);
}


/**
 * Get a kommission by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getKommissionById(req, res) {
  const kommissionId = req.params.id;

  const kommission = await kommissionService.getKommissionById(kommissionId);

  res.json(kommission);
}


/**
 * Update a kommission.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateKommission(req, res) {
  let newKommission = new Kommission({
    ...req.body,
    _embedded: undefined, // Remove the only external object
  });

  const kommissionId = req.params.id;

  newKommission = await kommissionService.updateKommission(kommissionId, newKommission, req.body._embedded);

  res.json(newKommission);
}

/**
 * Delete a kommission.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteKommission(req, res) {
  const kommissionId = req.params.id;

  const kommission = await kommissionService.deleteKommission(kommissionId);

  res.json(kommission);
}

module.exports = {
  getAllKommissions,
  createKommission,
  updateKommission,
  getKommissionById,
  deleteKommission,
  getTasks,
};
