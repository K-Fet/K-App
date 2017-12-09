const logger = require('../../logger');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const { jwtSecret } = require('../../config/jwt');
const { verify } = require('../../utils/password-manager');

const { User, JWT } = require('../models');

/**
 * Check if a token is revoked or not.
 *
 * @param tokenId {String} JIT
 * @returns {Promise<Boolean>} Return false if the token is not revoked
 */
async function isTokenRevoked(tokenId) {
    logger.info('Auth service: is token revoked');

    return !!await JWT.findOne({ where: { revoked: true, id: tokenId } });
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

    const user = await User.findOne({ where: { email } });

    if (!user || !verify(password, user.password)) {
        const e = new Error('Bad email/password combination');
        e.name = 'LoginError';
        throw e;
    }
    // Sign with default (HMAC SHA256)
    const id = uuidv4();

    const token = new JWT({
        id
    });

    await user.addJWT(token);

    // TODO Add permissions in a better way
    const permissions = [
        'barman:read',
        'user:read'
    ];

    logger.info(`Logging user ${user.id}, has permissions : ${permissions.join(', ')}`);

    return jwt.sign({
        jit: id,
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
    const token = await JWT.findById(tokenId);

    if (!token) {
        const e = new Error('This token does not exist');
        e.name = 'LogoutError';
        throw e;
    }

    await token.update({ revoked: true });
}


module.exports = {
    isTokenRevoked,
    login,
    logout
};
