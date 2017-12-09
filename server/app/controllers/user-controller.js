const logger = require('../../logger');
const userService = require('../services/user-service');

/**
 * Fetch all the users from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();

        res.json(users);
    } catch (e) {
        logger.error('Error while getting all users', e);
        res.sendStatus(500);
    }

    return res.end();
}

module.exports = {
    getAllUsers,
};

