const AbstractDAO = require('./abstract-dao');
const Service = require('../models/service');

const SERVICE_TABLE = 'service';

/**
 * Service DAO.
 */
class ServiceDAO extends AbstractDAO {

    /**
     * Find all services in database.
     *
     * @returns {Promise<Array>}
     */
    async findAll() {
        const [rows] = await this.db.execute(`SELECT * FROM \`${SERVICE_TABLE}\``);

        return rows.map(row => {
            const s = new Service();

            s.id = row.id;
            s.name = row.name;
            s.startingDate = row.startingDate;
            s.finishDate =  row.finishDate;
            s.nbMax = row.nbMax;
            s.categoryId = row.categoryId;

            return s;
        });
    }
}

module.exports = ServiceDAO;
