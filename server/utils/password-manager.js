/**
 * Check if a password is equal to a argon 2 hash.
 *
 * @param password Not encrypted password
 * @param hash Encrypted password
 * @returns {Promise<boolean>} If the password matches the hash
 */
async function verify(password, hash) {
    // TODO Argon2 verify
    return password === hash;
}


module.exports = {
    verify
};
