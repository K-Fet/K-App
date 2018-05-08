const { Model } = require('sequelize');

/**
 * This class is the joining table between a Task and a Kommission.
 */
class TaskKommissionWrapper extends Model {

    /**
     * Initialization function.
     *
     * @param sequelize
     * @returns {Model}
     */
    static init(sequelize) {
        return super.init({}, { sequelize });
    }
}

module.exports = {
    TaskKommissionWrapper
};
