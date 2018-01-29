const barmanService = require('../services/barman-service');
const { Barman } = require('../models');
const { BarmanSchema } = require('../models/schemas');
const { checkStructure, createUserError } = require('../../utils');

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
    const schema = BarmanSchema.requiredKeys(
        'firstName',
        'lastName',
        'connection',
        'connection.username',
        'nickname',
        'dateOfBirth',
        'flow'
    );

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.details.message);

    let newBarman = new Barman({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickname: req.body.nickname,
        facebook: req.body.facebook,
        dateOfBirth: req.body.dateOfBirth,
        flow: req.body.flow,
        active: req.body.active
    });

    newBarman = await barmanService.createBarman(newBarman);

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
    const schema = BarmanSchema.min(1);
    const newUser = req.body;

    const { error } = schema.validate(newUser);
    if (error) throw createUserError('BadRequest', error.details.message);

    let newBarman = new Barman({
        ...newUser,
        _embedded: undefined // Remove the only external object
    });

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

    const services = await barmanService.getBarmanServices(barmanId);

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

    if (!checkStructure(req.body, ['id'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'id\']'
        );
    }

    let serviceId = req.body;

    let newService = await barmanService.createServiceBarman(barmanId, serviceId);

    res.json(newService);
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
    const serviceId = req.body;

    const service = await barmanService.deleteServiceBarman(barmanId, serviceId);

    res.json(service);
}

module.exports = {
    getAllBarmen,
    createBarman,
    getBarmanById,
    updateBarman,
    deleteBarman,
    getServicesBarman,
    createServiceBarman,
    deleteServiceBarman
};
