module.exports = {
    /**
     * Secret used by `express-jwt`.
     *
     * Must be define in 'production' mode.
     */
    jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'devModeSecret' : undefined),

    /**
     * Expiration duration for a token, in hour.
     *
     * @default 1
     */
    expirationDuration: 1
};
