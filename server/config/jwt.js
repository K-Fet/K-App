module.exports = {
    /**
     * Secret used by `express-jwt`.
     *
     * Must define to work properly.
     * If not, it will generate a random secret
     * available only for the lifetime of the app.
     */
    jwtSecret: process.env.JWT_SECRET
};
