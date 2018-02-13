const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema, ConnectionInformationSchema } = require('./schemas');

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

            // Do not delete row, even when the user delete is account
            paranoid: true
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

        this.hasOne(Barman, { as: 'godFather' });

        this.belongsTo(models.ConnectionInformation, { as: 'connection' });
    }
}

const BarmanSchema = Joi.object().keys({
    firstname: Joi.string(),
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
