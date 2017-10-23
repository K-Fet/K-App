const winston = require('winston');

/**
 * Says Hello World and compute 1+1.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function sayHelloWorld(req, res) {
    const [rows] = await req.db.query('SELECT 1 + 1 AS solution');
    req.db.release();

    res.send(`Hello World ! Result of 1 + 1 is ${rows[0].solution}`);

    winston.debug('API request to hello world:', rows[0]);

    res.end();
}


module.exports = {
    sayHelloWorld
};

