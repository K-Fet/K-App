const AbstractDAO = require('./abstract-dao');
const Member = require('../models/member');

const MEMBER_TABLE = 'member';

/**
 * Member DAO.
 */
class MemberDAO extends AbstractDAO {

    /**
     * Find all members in database.
     *
     * @returns {Promise<Array>}
     */
    async findAll() {
        const [rows] = await this.db.execute(`SELECT * FROM \`${MEMBER_TABLE}\``);

        return rows.map(row => {
            const m = new Member();

            m.id = row.id;
            m.createdAt = row.createdAt;
            m.firstName = row.firstName;
            m.lastName = row.lastName;
            m.school = row.school;

            return m;
        });
    }
}

module.exports = MemberDAO;

