const winston = require('winston');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const { AuthDAO, UserDAO } = require('../dao/');
const { jwtSecret } = require('../../config/jwt');
const { verify } = require('../../utils/password-manager');

const authDAO = new AuthDAO();
const userDAO = new UserDAO();


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
    await userDAO.init();
    const user = await userDAO.findByEmail(email);
    userDAO.end();

    if (!user || !verify(password, user.password)) {
        const e = new Error('Bad email/password combination');
        e.name = 'LoginError';
        throw e;
    }
    // Sign with default (HMAC SHA256)
    const jit = uuidv4();

    await authDAO.init();
    await authDAO.saveNewTokenId(user.id, jit);
    authDAO.end();

    const permissions = [];

    winston.info(`Logging user ${user.id}, has permissions : ${permissions.join(', ')}`);

    // TODO Add permissions
    return jwt.sign({
        jit,
        permissions
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
