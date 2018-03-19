const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represent a Role.
 */
class Role extends Model {

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
            },

            description: DataTypes.STRING,
        }, {
            sequelize,
            updatedAt: false,
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Barman, {
            through: models.RoleWrapper,
            as: 'barmen',
        });

        this.belongsToMany(models.Permission, {
            through: 'RolePermissions',
            as: 'permissions',
        });
    }
}


const RoleSchema = Joi.object()
    .keys({
        name: Joi.string(),
        description: Joi.string(),
        _embedded: Joi.object()
            .keys({
                barmen: AssociationChangesSchema,
                permissions: AssociationChangesSchema
            }),
    });

module.exports = {
    Role,
    RoleSchema,
};
