const { Model, DataTypes, Op } = require('sequelize');
const Joi = require('joi');
const { Registration } = require('./registration');
const { getCurrentSchoolYear } = require('../../utils');

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

      scopes: {
        active(value) {
          return {
            order: [
              [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
            ],
            include: [
              {
                model: Registration,
                as: 'registrations',
                attributes: ['year', 'createdAt'],
                where: {
                  year: {
                    [Op.eq]: value,
                  },
                },
              },
            ],
          };
        },
        inactive(value) {
          return {
            order: [
              [{ model: Registration, as: 'registrations' }, 'year', 'DESC'],
            ],
            include: [
              {
                model: Registration,
                as: 'registrations',
                attributes: ['year', 'createdAt'],
              },
            ],
            group: 'id',
            having: sequelize.where(sequelize.fn('MAX', sequelize.col('registrations.year')), { [Op.lt]: value }),
          };
        },
      },
    });
  }


  /**
   * Set associations for the model.
   */
  static associate({ Registration }) { // eslint-disable-line no-shadow
    this.hasMany(Registration, { as: 'registrations', onDelete: 'CASCADE', foreignKey: 'memberId' });
  }
}

const MemberSchema = Joi.object({
  id: Joi.number().integer(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  school: Joi.string(),
});

module.exports = {
  Member,
  MemberSchema,
};
