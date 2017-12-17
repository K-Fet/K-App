const logger = require('../../logger');
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
    } catch(e) {
        logger.error('Error while getting all barmen', e),
        res.sendStatus(500);
    }

    return res.end();
}

/**
 * Fetch the barman linked to an Id from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getBarmanById(req, res) {
    try {
        const barmanId = req.params.barmanId;
        const barman = await barmanService.getBarmanById(barmanId);

        res.json(barman);
    }catch (e) {
        logger.error('Error while getting a barman by his Id', e);
        res.sendStatus(500);
    }

    return res.end();
}

/**
 * Delete the barman linked to an Id from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteBarmanById(req, res) {
    try {
        const barmanId = req.params.barmanId;
        await barmanService.deleteBarmanById(barmanId);

    } catch (e) {
        logger.error('Error while deleting a barman by his Id', e);
        res.sendStatus(500);
    }
}

/**
 * Fetch the services of a barman linked to an Id from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getServicesBarman(req, res) {
    try {
        const barmanId = req.params.barmanId;
        const services = await barmanService.getServicesOfBarman(barmanId);

        res.json(services);
    } catch (e) {
        logger.error('Error while getting Services of a barman');
        res.sendStatus(500);
    }
    return res.end();
}

module.exports = {
    getAllBarmen,
    getBarmanById,
    deleteBarmanById,
    getServicesBarman
};
