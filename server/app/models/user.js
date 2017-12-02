const { Model, DataTypes } = require('sequelize');

/**
 * This class represents a member.
 */
class User extends Model {
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
            }
        }, { sequelize });
    }
}

module.exports = {
    User
};
