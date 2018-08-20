const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');

/**
 * This class represents connection information.
 * An barman/user cannot login without it.
 */
class ConnectionInformation extends Model {
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
        autoIncrement: true,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
      },

      passwordToken: {
        type: DataTypes.STRING,
      },

      emailToken: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize,
    });
  }


  /**
   * Set associations for the model.
   */
  static associate({ JWT, Barman, SpecialAccount }) {
    this.hasMany(JWT, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'connectionId',
        allowNull: false,
      },
      as: 'jwt',
    });

    this.hasOne(Barman, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'connectionId',
        allowNull: false,
      },
      as: 'barman',
    });
    this.hasOne(SpecialAccount, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'connectionId',
        allowNull: false,
      },
      as: 'specialAccount',
    });
  }
}

const ConnectionInformationSchema = Joi.object({
  email: Joi.string().email(),
}).min(1);

module.exports = {
  ConnectionInformation,
  ConnectionInformationSchema,
};
