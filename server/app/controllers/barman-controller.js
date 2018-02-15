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
    
    const newUser = req.body;

    let newBarman = new Barman({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        connection: newUser.connection,
        nickname: newUser.nickname,
        facebook: newUser.facebook,
        dateOfBirth: newUser.dateOfBirth,
        flow: newUser.flow,
        active: newUser.active
    });

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

    // Le passage en format ISO est en UTC donc on rajoute une heure pour être en UTC+1
    var startDate = new Date(req.query.start*1000 + (1 * 60 * 60 * 1000));
    var endDate = new Date(req.query.end*1000 + (1 * 60 * 60 * 1000));

    startDate = startDate.toISOString();
    endDate = endDate.toISOString();

    const services = await barmanService.getBarmanServices(barmanId, startDate, endDate);

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

    if (!checkStructure(req.body, [ ])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [ ]'
        );
    }

    const servicesId = req.body;

    await barmanService.createServiceBarman(barmanId, servicesId);

    res.sendStatus(200);
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

    if (!checkStructure(req.body, [ ])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [ ]'
        );
    }

    const servicesId = req.body;

    await barmanService.deleteServiceBarman(barmanId, servicesId);

    res.sendStatus(200);
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
