const { Model, DataTypes } = require('sequelize');

/**
 * This class is the joining table between a Role and a Barman.
 */
class RoleWrapper extends Model {

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


    /**
     * Set associations for the model
     * @param models there is not any associations
     */
    static associate(models) { // eslint-disable-line no-unused-vars
    }
}

module.exports = {
    RoleWrapper
};
