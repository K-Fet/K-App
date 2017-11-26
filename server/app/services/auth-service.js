const winston = require('winston');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const { AuthDAO } = require('../dao/auth-dao');
const { jwtSecret } = require('../../config/jwt');
const { verify } = require('../../utils/password-manager');

const authDAO = new AuthDAO();

/**
 * Check if a token is revoked or not.
 *
 * @param tokenId {String} JIT
 * @returns {Promise<Boolean>} Return false if the token is not revoked
 */
async function isTokenRevoked(tokenId) {
    await authDAO.init();

    winston.info('Auth service: is token revoked');
    const isRevoked = await authDAO.isTokenRevoked(tokenId);

    authDAO.end();
    return isRevoked;
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

    if (!user || !verify(password, user.password)) {
        const e = new Error('Bad email/password combination');
        e.name = 'LoginError';
        throw e;
    }

    // Sign with default (HMAC SHA256)
    const jit = uuidv4();
    await authDAO.saveNewTokenId(user.id, jit);

    authDAO.end();

    // TODO Add permissions
    return jwt.sign({
        jit: jit
    }, jwtSecret);
}

/**
 * Logout a user by revoking his token.
 *
 * @param tokenId Token's JIT
 * @return {Promise.<void>} Nothing
 * @throws An error if the token could not be find.
 */
async function logout(tokenId) {
    await authDAO.init();

    await authDAO.revokeToken(tokenId);

    authDAO.end();
}


module.exports = {
    isTokenRevoked,
    login,
    logout
};
