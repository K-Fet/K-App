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
                autoIncrement: true,
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
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'connectionId',
                allowNull: false
            },
            as: 'jwt'
        });

        this.hasOne(models.Barman, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'connectionId',
                allowNull: false
            },
            as: 'barman'
        });
        this.hasOne(models.SpecialAccount, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'connectionId',
                allowNull: false
            },
            as: 'specialAccount'
        });
    }
}

module.exports = {
    ConnectionInformation
};
