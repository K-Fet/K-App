const { Model, DataTypes } = require('sequelize');

/**
 * This class is the joining table between a Role and a Barman.
 */
class RoleWrapper extends Model {
  /**
     * Initialization function.
     *
     * @param sequelize
     * @returns {Model}
     */
  static init(sequelize) {
    return super.init({
      finishedAt: DataTypes.DATE,
    }, {
      sequelize,
      updatedAt: false,
    });
  }
}

module.exports = {
  RoleWrapper,
};
