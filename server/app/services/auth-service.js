const logger = require('../../logger');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const { jwtSecret } = require('../../config/jwt');
const { verify, createUserError } = require('../../utils');

const { ConnectionInformation, JWT } = require('../models');

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
 * Log a member and create a JWT Token.
 * The token will contain every
 * permissions given for the user.
 *
 * @param username Username used to login
 * @param password Unencrypted password
 * @returns {Promise<String>} JWT Signed token
 */
async function login(username, password) {

    const user = await ConnectionInformation.findOne({ where: { username } });

    if (!user || !verify(password, user.password)) {
        throw createUserError('LoginError', 'Bad username/password combination');
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
        'member:read'
    ];

    logger.info(`Logging user ${user.id}, has permissions : ${permissions.join(', ')}`);

    return jwt.sign({
        jit: id,
        permissions
    }, jwtSecret);
}

/**
 * Logout a member by revoking his token.
 *
 * @param tokenId Token's JIT
 * @return {Promise.<void>} Nothing
 * @throws An error if the token could not be find.
 */
async function logout(tokenId) {
    const token = await JWT.findById(tokenId);

    if (!token) throw createUserError('LogoutError', 'This token does not exist');

    await token.update({ revoked: true });
}


module.exports = {
    isTokenRevoked,
    login,
    logout
};
