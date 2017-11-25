const winston = require('winston');

/**
 * Login a user by responding with a JWT.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function login(req, res) {
    try {

    } catch (e) {
        winston.error('Error while logging user', e);
        res.sendStatus(500);
    }

    return res.end();
}

module.exports = {
    login,
};
