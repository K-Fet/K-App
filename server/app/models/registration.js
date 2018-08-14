const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');

/**
 * This class represent a Registration of a member.
 */
class Registration extends Model {
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

      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 2017 },
      },
    }, {
      sequelize,
      updatedAt: false,
    });
  }


  /**
   * Set associations for the model
   */
  static associate({ Member }) {
    this.belongsTo(Member, {
      as: 'member',
      foreignKey: {
        allowNull: false,
      },
    });
  }
}

const RegistrationSchema = Joi.object().keys({
  id: Joi.number().integer(),
  year: Joi.number().integer(),
});

module.exports = {
  Registration,
  RegistrationSchema,
};
