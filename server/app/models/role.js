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

      description: DataTypes.TEXT,
    }, {
      sequelize,
      updatedAt: false,
    });
  }


  /**
   * Set associations for the model
   */
  static associate({ Barman, Permission, RoleWrapper }) {
    this.belongsToMany(Barman, { through: RoleWrapper, as: 'barmen' });

    this.belongsToMany(Permission, { through: 'RolePermissions', as: 'permissions' });
  }
}


const RoleSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string(),
  description: Joi.string(),
  _embedded: Joi.object({
    barmen: AssociationChangesSchema,
    permissions: AssociationChangesSchema,
  }),
});

module.exports = {
  Role,
  RoleSchema,
};
