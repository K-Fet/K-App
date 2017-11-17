const pool = require('../../db');

/**
 * Abstract DAO.
 * Base class for all DAO, provide a db connection.
 *
 * @member db Database object
 * @see https://github.com/sidorares/node-mysql2#using-promise-wrapper
 */
class AbstractDAO {

    /**
     * Constructor.
     */
    constructor() {
    }

    /**
     * Initialize the field `db` with a database object.
     * MUST BE Called before any function.
     *
     * @returns {Promise<void>}
     */
    async init() {
        this.db = await pool.getConnection();
    }


    /**
     * Release the database connection.
     * MUST BE Called at the end of all operation
     */
    end() {
        if (this.db) {
            this.db.release();
            this.db = null;
        }
    }

}

module.exports = AbstractDAO;
