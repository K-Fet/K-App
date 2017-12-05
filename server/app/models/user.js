const { Model, DataTypes } = require('sequelize');

/**
 * This class represents a member.
 */
class User extends Model {
    /**
     * Initialization function.
     *
     * @param sequelize Sequelize instance
     * @param child Configuration object from a child class
     * @returns {Model}
     */
    static init(sequelize, child) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            deletedAt: DataTypes.DATE,

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            },

            school: DataTypes.STRING,

            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            ...child
        }, {
            sequelize,

            // Do not delete row, even when the user delete is account
            paranoid: true
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.hasMany(models.JWT, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    }
}

module.exports = {
    User
};
