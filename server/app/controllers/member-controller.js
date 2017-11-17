const winston = require('winston');
const memberService = require('../services/member-service');

/**
 * Fetch all the members from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllMembers(req, res) {
    try {
        const members = await memberService.getAllMembers();

        res.json(members);
    } catch (e) {
        winston.error('Error while getting all members', e);
        res.sendStatus(500);
    }

    return res.end();
}

module.exports = {
    getAllMembers,
};

