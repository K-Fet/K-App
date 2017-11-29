const winston = require('winston');
const { UserDAO } = require('../dao/user-dao');

const userDAO = new UserDAO();

/**
 * Return all users of the app.
 *
 * @returns {Promise<Array>} Users
 */
async function getAllUsers() {
    await userDAO.init();

    winston.info('User service: get all users');
    const users = await userDAO.findAll();

    userDAO.end();
    return users;
}

module.exports = {
    getAllUsers
};
