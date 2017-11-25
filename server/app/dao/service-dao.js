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

    /**
     * Find a service by Id  in database.
     *
     * @param id {Number} Integer id of a service
     * @returns {Promise<Array>}
     */
    async findById(id) {
        const [rows] = await this.db.execute(`SELECT * FROM \`${SERVICE_TABLE}\` WHERE id=?`, id);

        if(rows.lenght===0) {
            return null;
        }

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

    /**
     * Delete a service by Id  in database.
     *
     * @param id {Number} Integer id of a service
     * @returns {Promise<Array>}
     */
    async deleteServiceById(id) {

        await this.db.execute(`DELETE FROM \`${SERVICE_TABLE}\` WHERE id=?`, id);
        // console.log('Number of records deleted :'+result.affectedRows);

        return null;
    }

    /**
     * Add a service  in database.
     *
     * @param newService {Service} new Service 
     * @returns {Promise<Array>}
     */
    async addService(newService) {

        await this.db.execute(`INSERT INTO \`${SERVICE_TABLE}\`(name, nbMax, categoryId) VALUES(?, ?, ?)`, 
            [
                newService.name, 
                newService.nbMax, 
                newService.categoryId
            ]);

    }

    /**
     * Add a service  in database.
     *
     * @param newService {Service} new Service 
     * @returns {Promise<Array>}
     */
    async updateServiceById(newService) {
        console.log('entre dans addService dao');

        await this.db.execute(`UPDATE \`${SERVICE_TABLE}\` SET name=?, nbMax=?, categoryId=? WHERE id=?`,
            [
                newService.name, 
                newService.nbMax, 
                newService.categoryId, 
                newService.id
            ]);

    }

}

module.exports = ServiceDAO;
