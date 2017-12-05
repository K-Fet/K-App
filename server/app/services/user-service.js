const logger = require('../../logger');
const { User } = require('../models/user');

/**
 * Return all users of the app.
 *
 * @returns {Promise<Array>} Users
 */
async function getAllUsers() {

    logger.info('User service: get all users');
    return await User.findAll();
}

module.exports = {
    getAllUsers
};
