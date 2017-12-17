const logger = require('../../logger');
const { Barman } = require('../models/barman');
const { Service } = require ('../models/service');

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getAllBarmen() {

    logger.info('Barman service: get all barmen');
    return await Barman.findAll();
}

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function createBarman() { // quels sont les attributs à changer

    logger.info('Barman service: create a barman');
}

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getBarmanById(barmanId) {

    logger.info('Barman service: get a barman by his Id');
    return await Barman.findById(barmanId);
}

/**
 * Return all barmen of the app.
 *
 * @returns void
 */
async function deleteBarmanById(barmanId) {

    logger.info('Barman service: delete a barman by his Id');
    Barman.destroy({
        where :{Id: barmanId}
    });
}

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function updateBarmanById(barmanId) { // quels sont les attributs à changer

    logger.info('Barman service: update a barman by his Id');
    Barman.update({

    },
    { where :{Id: barmanId}

    });
}

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getServicesOfBarman(barmanId) {
    logger.info('Barman service: get services of a barman');
    return await Service.findAll({
        where:{Barman: barmanId}//faux à corriger
    });
}


module.exports = {
    getAllBarmen,
    createBarman,
    getBarmanById,
    deleteBarmanById,
    updateBarmanById,
    getServicesOfBarman
};
