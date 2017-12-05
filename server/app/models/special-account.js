const { User } = require('./user');
const { DataTypes } = require('sequelize');

/**
 * This class represents fa barman.
 */
class SpecialAccount extends User {

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
    static associate(models) { // eslint-disable-line no-unused-vars
    }
}

module.exports = {
    SpecialAccount
};
