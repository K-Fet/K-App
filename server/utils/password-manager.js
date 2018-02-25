const argon2 = require('argon2');

/**
 * Check if a password is equal to a argon 2 hash.
 *
 * @param hash Encrypted password
 * @param password Not encrypted password
 * @returns {Promise<boolean>} If the password matches the hash
 */
async function verify(hash, password) {
    return argon2.verify(hash, password);
}

/**
 * Hash a password using argon2.
 *
 * @param password {string} Unencrypted password
 * @return {Promise<string>}
 */
async function hash(password) {
    return argon2.hash(password);
}

module.exports = {
    verify,
    hash
};
