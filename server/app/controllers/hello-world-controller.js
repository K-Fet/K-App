const winston = require('winston');

/**
 * Says Hello World and compute 1+1.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function sayHelloWorld(req, res) {
    //async: declare a function which can wait for a expression with the 'await' keyword
    const [rows] = await req.db.query('SELECT 1 + 1 AS solution');
    // Declare const array
    // await: wait for the expression
    // req.db.query: execute function called query of the db object define in req object (parameter)
    // When the expression after await is resolved, rows contains the return values

    req.db.release();
    // Release the database connection

    res.send(`TestNo2 : Hello World ! Result of 1 + 1 is ${rows[0].solution}`);
    // res.send(): send the string back to the client 

    winston.debug('API request to hello world:', rows[0]);
    // Log the API call

    res.end();
    // Close the response
}

// async function otherFunction(req, res) {
//some other stuff heure 
// }

module.exports = {
    sayHelloWorld,
    /* Here you can export all functions you want to use outside the file
    */
};

