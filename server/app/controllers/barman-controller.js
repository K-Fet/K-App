const barmanService = require('../services/barman-service');
const { Barman } = require('../models/barman');
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
    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['firstName', 'lastName', 'nickname', 'dateOfBirth', 'flow'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'firstName\', \'lastName\', \'nickname\', \'dateOfBirth\', \'flow\']'
        );
    }

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
    const newUser = req.body;

    if (!newUser) throw createUserError('BadRequest', 'Missing body');

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
