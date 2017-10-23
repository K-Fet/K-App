const winston = require('winston');
const pool = require('../../db');

/**
 * This middleware get a new connection from the database.
 * If it fails, it sends a 500 error.
 *
 * @param req Request
 * @param res Response
 * @param next Callback
 * @return {Promise.<void>}
 */
async function database(req, res, next) {
    try {
        req.db = await pool.getConnection();
        winston.silly('Populate request with database connection');
        next();
    } catch (err) {
        winston.warn('Error while getting a database connection', err);
        res.sendStatus(500);
        res.end();
    }
}

module.exports = database;
