module.exports = {
    /**
     * SSL Configuration.
     * When enable, indicates a `key` and a `cert` field
     *
     * @example
     * ssl: {
     *     key: '/path/to/letsencrypt/key',
     *     cert: '/path/to/letsencrypt/certificate',
     * }
     *
     * @default false
     */
    ssl: false,

    /**
     * Port where the http web server will listen
     */
    port: process.env.PORT || 3000,

};
