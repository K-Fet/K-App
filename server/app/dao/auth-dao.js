const AbstractDAO = require('./abstract-dao');

const AUTH_TABLE = 'jwt-token';

/**
 * Auth DAO.
 * Will be in charge of loading and saving JWT token.
 */
class AuthDAO extends AbstractDAO {


    /**
     * Revoke a token.
     *
     * @param tokenId Token's JIT to revoke
     * @return {Promise.<void>} Nothing
     * @throws An error if the token could not be find
     */
    async revokeToken(tokenId) {
        const [results] = await this.db.execute(
            `UPDATE \`${AUTH_TABLE}\` SET revoked=TRUE WHERE tokenId=?`,
            tokenId
        );

        // If the token does not exist, throw an error
        if (results.affectedRows === 0) {
            const e = new Error('Token does not exist');
            e.name = 'RevokeTokenError';
            throw e;
        }
    }

    /**
     * Check if a token is revoked or not.
     *
     * @param tokenId Token id (UUID)
     * @return {Promise.<Boolean>} false if the token does not exist or is not revoked.
     */
    async isTokenRevoked(tokenId) {
        const [rows] = await this.db.execute(
            `SELECT tokenId FROM \`${AUTH_TABLE}\` WHERE tokenId=? AND revoked IS TRUE`,
            tokenId
        );

        return rows.length === 1;
    }

    /**
     * Save a new token for the app.
     *
     * @param userId {Number} User id
     * @param tokenId {String} UUID string representing the JIT field of the JWT.
     * @return {Promise.<void>} If no problem
     */
    async saveNewTokenId(userId, tokenId) {
        await this.db.execute(
            `INSERT INTO \`${AUTH_TABLE}\` (tokenId, userId) VALUES (?, ?)`,
            [userId, tokenId]
        );
    }
}

module.exports = {
    AuthDAO
};
