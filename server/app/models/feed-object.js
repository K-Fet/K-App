const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema } = require('./association-changes');
const { MediaSchema } = require('./media');

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
   */
  static associate({ Media, Category }) {
    this.hasMany(Media, {
      foreignKey: 'feedObjectId',
      as: 'medias',
      onDelete: 'CASCADE',
    });
    this.belongsToMany(Category, {
      through: 'feedObjectCategoryWrappers',
      foreignKey: 'feedObjectId',
      as: 'categories',
    });
  }
}

const FeedObjectSchema = Joi.object({
  id: Joi.number().integer(),
  title: Joi.string(),
  content: Joi.string(),
  date: Joi.string().isoDate(),
  pin: Joi.boolean(),
  source: Joi.string().valid('Kapp', 'Facebook'),
  openLink: Joi.string(),
  medias: Joi.array().items(MediaSchema.requiredKeys(
    'url',
    'type',
  )),
  _embedded: Joi.object({
    categories: AssociationChangesSchema,
  }),
});

module.exports = {
  FeedObject,
  FeedObjectSchema,
};
