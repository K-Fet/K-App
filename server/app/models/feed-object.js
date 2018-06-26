const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represent a FeedObject.
 */
class FeedObject extends Model {
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

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      pin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },

      source: {
        type: DataTypes.ENUM('Kapp', 'Facebook'),
        allowNull: false,
      },

      openLink: DataTypes.STRING,
    }, {
      sequelize,
    });
  }


  /**
     * Set associations for the model
     * @param models
     */
  static associate(models) {
    this.hasMany(models.Media, {
      foreignKey: {
        name: 'mediaId',
        allowNull: false,
      },
      as: 'medias',
    });
    this.hasMany(models.Category, {
      foreignKey: {
        name: 'categoryId',
        allowNull: false,
      },
      as: 'categories',
    });
  }
}

const FeedObjectSchema = Joi.object().keys({
  id: Joi.number().integer(),
  title: Joi.string(),
  content: Joi.string(),
  date: Joi.string().isoDate(),
  pin: Joi.boolean(),
  source: Joi.string().valid('Kapp', 'Facebook'),
  openLink: Joi.string(),
  _embedded: Joi.object({
    medias: AssociationChangesSchema,
    categories: AssociationChangesSchema,
  }),
});

module.exports = {
  FeedObject,
  FeedObjectSchema,
};
