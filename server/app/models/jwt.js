const { Model, DataTypes } = require('sequelize');

/**
 * This class represents a JWT.
 */
class JWT extends Model {
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

            revoked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        }, { sequelize });
    }

    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.Post);
        this.hasMany(models.User, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    }
}

module.exports = {
    JWT
};
