module.exports = {
    /**
     * Database address.
     *
     * @default 'localhost'
     */
    host: process.env.DB_HOST || 'localhost',

    /**
     * Username of the database.
     * Must change when running in prod.
     *
     * @default 'root'
     */
    user: process.env.DB_USER || 'root',

    /**
     * Password to access the database.
     * In production, use environment variables.
     *
     * @default ''
     */
    password: process.env.DB_PWD || 'password',

    /**
     * Name of the database where to save data.
     *
     * @default 'kapp'
     */
    database: process.env.DB_DATABASE || 'kapp',

    /**
     * Debug flag.
     * Set true if you want to see debug logger.
     *
     * @default false
     */
    debug: false
};
