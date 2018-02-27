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
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            description: DataTypes.STRING,
        }, {
            sequelize,
            updatedAt: false
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
<<<<<<< HEAD:server/app/models/role.js
    static associate(models) {
        this.belongsToMany(models.Barman, { through: models.RoleWrapper, as: 'barmen' });
    }
=======
    /*static associate(models) {
        //this.hasMany(models.Service, { as: 'services' });
    }*/
>>>>>>> CRUD totalement fonctionnel:server/app/models/category.js
}


const RoleSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    _embedded: Joi.object().keys({
        barmen: AssociationChangesSchema
    })
});

module.exports = {
    Role,
    RoleSchema
};
