const userService = require('../services/user-service');
const { User } = require('../models/user');
const { checkStructure, createUserError } = require('../../utils');

/**
 * Fetch all the users from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllUsers(req, res) {
    const users = await userService.getAllUsers();

    res.json(users);
}

/**
 * Create an user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createUser(req, res) {

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['email', 'firstName', 'lastName'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'email\', \'firstName\', \'lastName\']'
        );
    }

    let newUser = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        school: req.body.school,
        active: req.body.active,
    });

    newUser = await userService.createUser(newUser);

    res.json(newUser);
}


/**
 * Get an user by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getUserById(req, res) {
    const userId = req.params.id;

    const user = await userService.getUserById(userId);

    res.json(user);
}


/**
 * Update an user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateUser(req, res) {

    // FIXME We should check the type of each provided field, instead of just the presence
    if (!checkStructure(req.body, ['email', 'firstName', 'lastName'])) {
        throw createUserError(
            'BadRequest',
            'The body has missing properties, needed: [\'email\', \'firstName\', \'lastName\']'
        );
    }

    let newUser = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        school: req.body.school,
        active: req.body.active,
    });

    const userId = req.params.id;

    newUser = await userService.updateUser(userId, newUser);

    res.json(newUser);
}

/**
 * Delete an user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteUser(req, res) {
    const userId = req.params.id;

    const user = await userService.deleteUser(userId);

    res.json(user);
}


module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    deleteUser
};

