const { DataTypes, Model } = require('sequelize');

/**
 * This class represents a barman.
 */
class Barman extends Model {

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

            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            nickname: {
                type: DataTypes.STRING,
                allowNull: false
            },

            facebook: {
                type: DataTypes.STRING
            },

            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            flow: {
                type: DataTypes.TEXT
            },
        }, {
            sequelize,

            // Do not delete row, even when the user delete is account
            paranoid: true
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Kommission, { through: models.KommissionWrapper });
        this.belongsToMany(models.Role, { through: models.RoleWrapper });
        this.belongsToMany(models.Service, { through: models.ServiceWrapper });

        this.hasOne(Barman, { as: 'godFather' });

        this.hasOne(models.ConnectionInformation, { as: 'connection' });
    }
}

module.exports = {
    Barman
};
