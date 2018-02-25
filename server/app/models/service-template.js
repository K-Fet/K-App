const { DataTypes, Model } = require('sequelize');

/**
 * This class represents a template for a list of services for a week.
 */
class ServiceTemplate extends Model {

    /**
     * Initialization function.
     *
     * @param sequelize
     * @returns {Model}
     */
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) { // eslint-disable-line no-unused-vars
    }
}

module.exports = {
    ServiceTemplate
};
