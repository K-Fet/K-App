const { DataTypes, Model } = require('sequelize');

/**
 * This class represents a special account (e.g.: admin).
 */
class SpecialAccount extends Model {

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

            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            description: {
                type: DataTypes.TEXT,
            },
        }, {
            sequelize,
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) {
        this.belongsTo(models.ConnectionInformation, { as: 'connection' });

        this.belongsToMany(models.Permission, {
            through: 'SpecialAccountPermissions',
            as: 'permissions',
        });
    }
}

module.exports = {
    SpecialAccount,
};
