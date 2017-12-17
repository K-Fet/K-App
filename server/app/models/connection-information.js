const { DataTypes, Model } = require('sequelize');

/**
 * This class represents connection information.
 * An barman/user cannot login without it.
 */
class ConnectionInformation extends Model {

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
                primaryKey: true
            },

            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },

            password: {
                type: DataTypes.STRING
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
    static associate(models) {
        this.hasMany(models.JWT, {
            as: 'tokens',
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });

        this.belongsTo(models.Barman);
        this.belongsTo(models.SpecialAccount);
    }
}

module.exports = {
    ConnectionInformation
};
