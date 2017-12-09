const { Model, DataTypes } = require('sequelize');

/**
 * This class is the joining table between a Kommission and a Barman.
 */
class KommissionWrapper extends Model {

    /**
     * Initialization function.
     *
     * @param sequelize
     * @returns {Model}
     */
    static init(sequelize) {
        return super.init({
            finishedAt: DataTypes.DATE
        }, {
            sequelize,
            updatedAt: false
        });
    }
}

module.exports = {
    KommissionWrapper
};
