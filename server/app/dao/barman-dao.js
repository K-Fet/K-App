const AbstractDAO = require('./abstract-dao');
const Barman = require('../models/barman.js');

const BARMAN_TABLE = 'barman';

/**
 * Barman DAO.
 */
class BarmanDAO extends AbstractDAO{
    /**
     * Find all members in database.
     *
     * @returns {Promise<Array>}
     */
    async findAll() {
        const [rows] = await this.db.execute(`SELECT * FROM \`${BARMAN_TABLE}\``);

        return rows.map(row => {
            const b = new Barman();

            b.id = row.id;
            b.email = row.email;
            b.password = row.password;
            b.surnom = row.surnom;
            b.createdAt = row.createdAt;
            b.code = row.code;
            b.firstName = row.firstName;
            b.lastName = row.lastName;
            b.birth = row.birth;
            b.facebook = row.facebook;
            b.godfather = row.godfather;
            b.cheminement = row.cheminement;

            return b;
        });
    }
}

module.exports = BarmanDAO;
