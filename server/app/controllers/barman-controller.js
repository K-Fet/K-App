const barmanService = require('../services/barman-service');
const { Barman } = require('../models');
const { BarmanSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

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

module.exports = {
    getAllBarmen,
    createBarman,
    getBarmanById,
    updateBarman,
    deleteBarman
};
