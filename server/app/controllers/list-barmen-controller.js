const winston = require('winston');

/**
  * get list barmen
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getListBarmen(req, res) {
    //async: declare a function which can wait for a expression with the 'await' keyword
    const [rows] = await req.db.query('SELECT firstName as Name FROM kapp.barman');
    // Declare const array
    // await: wait for the expression
    // req.db.query: execute function called query of the db object define in req object (parameter)
    // When the expression after await is resolved, rows contains the return values

    req.db.release();
    // Release the database connection

    res.send(`Voici la liste des barmen de la K-Fet :  ${rows[1].Name}`);
    // res.send(): send the string back to the client 

    winston.debug('API request to get list of Barmen:', rows[1]);
    // Log the API call

    res.end();
    // Close the response
}

// async function otherFunction(req, res) {
//some other stuff heure 
// }

module.exports = {
    getListBarmen,
    /* Here you can export all functions you want to use outside the file
    */
};
