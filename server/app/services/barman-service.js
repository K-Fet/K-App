const logger = require('../../logger');
const { Barman } = require('../models/barman');

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getAllBarmen() {

    logger.info('Barman service: get all barmen');
    return await Barman.findAll();
}

module.exports = {
    getAllBarmen
};
