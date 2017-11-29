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
        this._db = null;
    }

    /**
     * Database getter.
     *
     * @throws Error if the db is not initialized (when #init() is called)
     * @return {Connection}
     */
    get db() {
        if (!this._db) {
            throw new Error('The db is not defined, you have to call #init() before any request!');
        }
        return this._db;
    }

    /**
     * Database setter.
     *
     * @throws Error if the db is already set. You must close the connection first {@link AbstractDAO#end}
     * @param db {Connection} Database object
     */
    set db(db) {
        throw new Error('The database must be initialized by #init()');
    }

    /**
     * Initialize the field `db` with a database object.
     * MUST BE Called before any function.
     *
     * @returns {Promise<void>}
     */
    async init() {
        this._db = await pool.getConnection();
    }


    /**
     * Release the database connection.
     * MUST BE Called at the end of all operation
     */
    end() {
        if (this._db) {
            this._db.release();
            this._db = null;
        }
    }

}

module.exports = {
    AbstractDAO
};
