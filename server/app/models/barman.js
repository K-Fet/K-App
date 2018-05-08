const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');
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
                autoIncrement: true
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            nickname: {
                type: DataTypes.STRING,
                allowNull: false
            },

            facebook: {
                type: DataTypes.STRING
            },

            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            flow: {
                type: DataTypes.TEXT
            },

            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
            sequelize,

            name: {
                plural: 'barmen',
                singular: 'barman'
            }
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Kommission, { through: models.KommissionWrapper, as: 'kommissions' });
        this.belongsToMany(models.Role, { through: models.RoleWrapper, as: 'roles' });
        this.belongsToMany(models.Service, { through: models.ServiceWrapper, as: 'services' });

        this.belongsTo(Barman, { as: 'godFather' });

        this.belongsTo(models.ConnectionInformation, {
            onDelete: 'CASCADE',
            as: 'connection'
        });

        this.belongsToMany(models.Task, { through: models.TaskKommissionWrapper, as: 'tasks' });
    }
}

const BarmanSchema = Joi.object().keys({
    id: Joi.number().integer(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    connection: ConnectionInformationSchema,
    active: Joi.boolean(),
    nickname: Joi.string(),
    facebook: Joi.string().uri(),
    dateOfBirth: Joi.string().isoDate(),
    flow: Joi.string(),

    _embedded: Joi.object({
        godFather: Joi.number().integer(),
        kommissions: AssociationChangesSchema,
        roles: AssociationChangesSchema,
    })
});


module.exports = {
    Barman,
    BarmanSchema
};
