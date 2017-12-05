const { User } = require('./user');
const { DataTypes } = require('sequelize');

/**
 * This class represents fa barman.
 */
class Barman extends User {

    /**
     * Initialization function.
     *
     * It differ from standard initialization
     * function as it extend {@link User}.
     *
     * @param sequelize
     * @returns {Model}
     */
    static init(sequelize) {
        return super.init(sequelize, {
            nickname: {
                type: DataTypes.STRING,
                allowNull: false
            },

            facebook: DataTypes.STRING,

            dateOfBirth: DataTypes.DATEONLY,

            flow: DataTypes.TEXT
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Kommission, { through: models.KommissionWrapper });
        this.belongsToMany(models.Role, { through: models.RoleWrapper });
        this.belongsToMany(models.Service, { through: models.ServiceWrapper });

        this.hasOne(Barman, { as: 'godFather' });
    }
}

module.exports = {
    Barman
};
