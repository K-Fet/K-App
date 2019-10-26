const { DataTypes, Model } = require('sequelize');
const Joi = require('@hapi/joi');
const { AssociationChangesSchema } = require('./association-changes');
const { ConnectionInformationSchema } = require('./connection-information');

/**
 * This class represents a barman.
 */
class Barman extends Model {
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

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      facebook: {
        type: DataTypes.STRING,
      },

      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      flow: {
        type: DataTypes.TEXT,
      },

      leaveAt: {
        type: DataTypes.DATEONLY,
      },
    }, {
      sequelize,

      name: {
        plural: 'barmen',
        singular: 'barman',
      },
    });
  }


  /**
   * Set associations for the model.
   */
  static associate({
    Kommission, Role, Service, KommissionWrapper, RoleWrapper,
    ServiceWrapper, ConnectionInformation, Task, TaskBarmanWrapper,
  }) {
    this.belongsToMany(Kommission, { through: KommissionWrapper, as: 'kommissions' });
    this.belongsToMany(Role, { through: RoleWrapper, as: 'roles' });
    this.belongsToMany(Service, { through: ServiceWrapper, as: 'services' });

    this.belongsTo(Barman, { as: 'godFather' });

    this.belongsTo(ConnectionInformation, { onDelete: 'CASCADE', as: 'connection' });

    this.belongsToMany(Task, { through: TaskBarmanWrapper, as: 'tasks' });
  }
}

const BarmanSchema = Joi.object({
  id: Joi.number().integer(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  connection: ConnectionInformationSchema,
  leaveAt: Joi.date().max('now').allow(null),
  nickname: Joi.string(),
  // eslint-disable-next-line
  facebook: Joi.string().regex(
    /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.(com|me)\/((\w)*#!\/)?([\w-]*\/)*([\w\-.]+)(\/)?/i,
  ),
  dateOfBirth: Joi.string().isoDate(),
  flow: Joi.string(),

  _embedded: Joi.object({
    godFather: Joi.number().integer(),
    kommissions: AssociationChangesSchema,
    roles: AssociationChangesSchema,
  }),
});


module.exports = {
  Barman,
  BarmanSchema,
};
