const winston = require('winston');
const AbstractDAO = require('./abstract-dao');
const Member = require('../models/member');

const MEMBER_TABLE = '';

/**
 * Member DAO.
 */
class MemberDAO extends AbstractDAO {

    /**
     *
     * @returns {Promise<Array>}
     */
    async findAll() {
        const [rows] = await this.db.execute(`SELECT * FROM \`${MEMBER_TABLE}\``);

        const members = [];

        rows.forEach(row => {
            const m = new Member();

            m.id = row.id;
            m.createdAt = row.createdAt;
            m.firstName = row.firstName;
            m.lastName = row.lastName;
            m.school = row.school;

            members.push(m);
        });

        return members;
    }
}

module.exports = MemberDAO;

