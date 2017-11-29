const { AbstractDAO } = require('./abstract-dao');
const { User } = require('../models/user');

const USER_TABLE = 'user';

/**
 * User DAO.
 */
class UserDAO extends AbstractDAO {

    /**
     * Find all members in database.
     *
     * @returns {Promise<Array>}
     */
    async findAll() {
        const [rows] = await this.db.execute(`SELECT * FROM \`${USER_TABLE}\``);

        return rows.map(row => User.parse(row));
    }

    /**
     * Find a user by their email.
     *
     * @param email Email
     * @returns {Promise<User>} Return null if not find.
     */
    async findByEmail(email) {
        const [rows] = await this.db.execute(
            `SELECT * FROM \`${USER_TABLE}\` WHERE email=?`,
            email
        );

        // Will return null if rows[0] is undefined
        return User.parse(rows[0]);
    }
}

module.exports = {
    UserDAO
};

