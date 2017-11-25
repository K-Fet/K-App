const AbstractDAO = require('./abstract-dao');

const AUTH_TABLE = 'jwt-token';

/**
 * Auth DAO.
 * Will be in charge of loading and saving JWT token.
 */
class AuthDAO extends AbstractDAO {

    async getRevokedJTI(token) {

    }

    async saveNewTokenId(userId, tokenId) {

    }

}

module.exports = {
    AuthDAO
};
