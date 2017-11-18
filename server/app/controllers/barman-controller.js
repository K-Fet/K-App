const winston = require('winston');
const barmanService = require('../services/barman-service');

/**
 * Fetch all the barmen from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllBarmen(req, res) {
    try {
        const barmen = await barmanService.getAllBarmen();

        res.json(barmen);
    } catch (e) {
        winston.error('Error while getting all barmen', e);
        res.sendStatus(500);
    }

    return res.end();
}

module.exports = {
    getAllBarmen,
};
