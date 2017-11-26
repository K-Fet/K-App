const router = require('express').Router();
const jwt = require('express-jwt');

const {jwtSecret} = require('../../config/jwt');
const {isTokenRevoked} = require('../services/auth-service');


/**
 * Check if the provided JWT is revoked or not.
 *
 * @param req Request
 * @param payload {Object} JWT Payload
 * @param done Callback
 */
function isRevokedCallback(req, payload, done) {
    const tokenId = payload.jit;

    isTokenRevoked(tokenId)
        .then(jit => done(null, !!jit))
        .catch(err => done(err));
}


// Install the middleware

router.use(jwt({
    secret: jwtSecret,
    isRevoked: isRevokedCallback
}));


// Handle errors when parsing token

/*eslint no-unused-vars: "off"*/
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token !');
    }
});

module.exports = router;
