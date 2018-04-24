const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');

/**
 * This class represent a Service.
 */
class Service extends Model {

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

            startAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            endAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            nbMax: {
                type: DataTypes.INTEGER,
                validate: { min: 1 }
            }
        }, {
            sequelize,
            updatedAt: false,
            createdAt: false,

            // Do not really delete row
            paranoid: true
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Barman, { through: models.ServiceWrapper, as: 'barmen' });
    }
}

const ServiceSchema = Joi.object().keys({
    id: Joi.number().integer(),
    startAt: Joi.date().iso(),
    endAt: Joi.date().iso().min(Joi.ref('startAt')),
    nbMax: Joi.number().integer(),
});

module.exports = {
    Service,
    ServiceSchema
};
