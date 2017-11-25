const winston = require('winston');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const {AuthDAO} = require('../dao/auth-dao');
const {jwtSecret} = require('../../config/jwt');
const {verify} = require('../../utils/password-manager');

const authDAO = new AuthDAO();

/**
 * Return all barmen of the app.
 *
 * @param tokenId {String} JIT
 * @returns {Promise<String>} Return null if the token is not revoked
 */
async function getRevokedTokenId(tokenId) {
    await authDAO.init();

    winston.info('Auth service: get revoked tokenId');
    const token = await authDAO.getRevokedJTI(tokenId);

    authDAO.end();
    return token;
}

/**
 * Log a user and create a JWT Token.
 * The token will contain every
 * permissions given by the user's role.
 *
 * @param email Email used to login
 * @param password Unencrypted password
 * @returns {Promise<String>} JWT Signed token
 */
async function login(email, password) {
    await authDAO.init();

    const user = await authDAO.findByEmail(email);

    // TODO Crypt password.
    if (!user || !verify('password', user.password)) {
        const e = new Error('Bad email/password combination');
        e.name = 'LoginError';
        throw e;
    }

    // Sign with default (HMAC SHA256)
    const uuid = uuidv4();
    await authDAO.saveNewTokenId();

    authDAO.end();

    return jwt.sign({
        jit: uuid
    }, jwtSecret);
}


module.exports = {
    getRevokedTokenId,
    login
};
