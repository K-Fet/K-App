const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represent a Kommission.
 */
class Kommission extends Model {

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

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            description: DataTypes.STRING,
        }, {
            sequelize,
            updatedAt: false
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Barman, { through: models.KommissionWrapper, as: 'barmen' });
    }
}

const KommissionSchema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    _embedded: Joi.object().keys({
        barmen: AssociationChangesSchema
    })
});

module.exports = {
    Kommission,
    KommissionSchema
};
