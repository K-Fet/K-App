const { Model } = require('sequelize');

/**
 * This class is the joining table between a Task and a Barman.
 */
class TaskBarmanWrapper extends Model {

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
    TaskBarmanWrapper
};
