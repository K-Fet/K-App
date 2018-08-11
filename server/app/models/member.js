const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');

/**
 * This class represents a member.
 */
class Member extends Model {
  /**
   * Initialization function.
   *
   * @param sequelize Sequelize instance
   * @returns {Model}
   */
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      school: DataTypes.STRING,
    }, {
      sequelize,

      // Do not delete row, even when the user delete is account
      paranoid: true,
    });
  }


  /**
   * Set associations for the model.
   */
  static associate({ Registration }) {
    this.hasMany(Registration, { as: 'registrations', onDelete: 'CASCADE' });
  }
}

const MemberSchema = Joi.object().keys({
  id: Joi.number().integer(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  school: Joi.string(),
});

module.exports = {
  Member,
  MemberSchema,
};
