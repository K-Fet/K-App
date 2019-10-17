const { Model, DataTypes } = require('sequelize');

/**
 * This class represents a JWT.
 */
class JWT extends Model {
  /**
   * Initialization function.
   *
   * @param sequelize
   * @returns {Model}
   */
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },

      revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    }, {
      sequelize,
    });
  }

  /**
   * Set associations for the model
   */
  static associate({ ConnectionInformation }) {
    this.belongsTo(ConnectionInformation, {
      as: 'connection',
      foreignKey: {
        allowNull: false,
      },
    });
  }
}

module.exports = {
  JWT,
};
