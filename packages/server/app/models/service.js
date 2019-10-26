const { Model, DataTypes } = require('sequelize');
const Joi = require('@hapi/joi');

/**
 * This class represent a Service.
 */
class Service extends Model {
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

      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      nbMax: {
        type: DataTypes.INTEGER,
        validate: { min: 1 },
      },
    }, {
      sequelize,
      updatedAt: false,
      createdAt: false,

      // Do not really delete row
      paranoid: true,
    });
  }


  /**
   * Set associations for the model
   */
  static associate({ Barman, ServiceWrapper }) {
    this.belongsToMany(Barman, { through: ServiceWrapper, as: 'barmen' });
  }
}

const ServiceSchema = Joi.object({
  id: Joi.number().integer(),
  startAt: Joi.date().iso(),
  endAt: Joi.date().iso().min(Joi.ref('startAt')),
  nbMax: Joi.number().integer(),
});

module.exports = {
  Service,
  ServiceSchema,
};
