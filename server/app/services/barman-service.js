const winston = require('winston');
const BarmanDAO = require('../dao/barman-dao');

const barmanDAO = new BarmanDAO();

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getAllBarmen() {
    await barmanDAO.init();

    winston.info('Barman service: get all barmen');
    const barmen = await barmanDAO.findAll();

    barmanDAO.end();
    return barmen;
}

module.exports = {
    getAllBarmen
};
