const { Model, DataTypes } = require('sequelize');
const Joi = require('@hapi/joi');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represent a Kommission.
 */
class Kommission extends Model {
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
  static associate({ Barman, KommissionWrapper, Task }) {
    this.belongsToMany(Barman, { through: KommissionWrapper, as: 'barmen' });
    this.hasMany(Task, {
      foreignKey: {
        name: 'kommissionId',
        allowNull: false,
      },
      as: 'tasks',
    });
  }
}

const KommissionSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string(),
  description: Joi.string(),
  _embedded: Joi.object({
    barmen: AssociationChangesSchema,
  }),
});

module.exports = {
  Kommission,
  KommissionSchema,
};
