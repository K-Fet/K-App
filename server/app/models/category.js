const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');

/**
 * This class represent a Category.
 */
class Category extends Model {
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
        unique: true,
      },

      description: DataTypes.STRING,
    }, {
      sequelize,
      updatedAt: false,
      name: {
        plural: 'categories',
        singular: 'category',
      },
    });
  }

  /**
   * Set associations for the model
   * @param models
   */
  static associate(models) {
    this.belongsToMany(models.FeedObject, {
      through: 'feedobjectcategorywrappers',
      foreignKey: 'categoryId',
    });
  }
}

const CategorySchema = Joi.object().keys({
  id: Joi.number().integer(),
  name: Joi.string(),
  description: Joi.string(),
});

module.exports = {
  Category,
  CategorySchema,
};
