/* eslint-disable max-classes-per-file */
const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');
const { getISODay, setISODay } = require('date-fns');

/**
 * This class represents a template for a list of services for a week.
 */
class Template extends Model {
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
    }, {
      sequelize,
    });
  }


  /**
   * Set associations for the model.
   */
  static associate({ TemplateUnit }) {
    this.hasMany(TemplateUnit, { onDelete: 'CASCADE', as: 'services' });
  }
}

/**
 * This class represent an unique service for a template.
 */
class TemplateUnit extends Model {
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
      nbMax: {
        type: DataTypes.INTEGER,
        validate: { min: 1 },
      },

      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // eslint-disable-next-line
        get() {
          const startAt = this.getDataValue('startAt');
          return {
            day: getISODay(startAt),
            hours: startAt.getHours(),
            minutes: startAt.getMinutes(),
          };
        },
        // eslint-disable-next-line
        set(val) {
          const date = setISODay(new Date(), val.day);
          date.setHours(val.hours);
          date.setMinutes(val.minutes);

          this.setDataValue('startAt', date);
        },
      },

      endAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // eslint-disable-next-line
        get() {
          const endAt = this.getDataValue('endAt');
          return {
            day: getISODay(endAt),
            hours: endAt.getHours(),
            minutes: endAt.getMinutes(),
          };
        },
        // eslint-disable-next-line
        set(val) {
          const date = setISODay(new Date(), val.day);
          date.setHours(val.hours);
          date.setMinutes(val.minutes);

          this.setDataValue('endAt', date);
        },
      },
    }, {
      sequelize,
    });
  }


  /**
   * Set associations for the model.
   */
  static associate() {}
}

const TemplateUnitSchema = Joi.object({
  nbMax: Joi.number(),
  startAt: Joi.object({
    day: Joi.number(),
    hours: Joi.number(),
    minutes: Joi.number(),
  }),
  endAt: Joi.object({
    day: Joi.number(),
    hours: Joi.number(),
    minutes: Joi.number(),
  }),
});

const TemplateSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string(),
  services: Joi
    .array()
    .items(TemplateUnitSchema.requiredKeys('startAt', 'endAt', 'nbMax'))
    .min(1),
});

module.exports = {
  Template,
  TemplateUnit,
  TemplateSchema,
  TemplateUnitSchema,
};
