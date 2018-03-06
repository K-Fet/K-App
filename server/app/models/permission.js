const { Model, DataTypes } = require('sequelize');

/**
 * This class represent a Permission.
 */
class Permission extends Model {

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
                autoIncrement: true,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: false,
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {} // eslint-disable-line
}

module.exports = {
    Permission,
};
