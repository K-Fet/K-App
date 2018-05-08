const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represent a Task.
 */
class Task extends Model {

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

            deadline: DataTypes.DATE,

            state: DataTypes.ENUM('Not started', 'In progress', 'Done', 'Abandoned'),

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
        this.belongsToMany(models.Barman, { through: models.TaskBarmanWrapper, as: 'barmen' });
        this.belongsToMany(models.Kommission, { through: models.TaskKommissionWrapper, as: 'kommissions' });
    }
}

const TaskSchema = Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string(),
    description: Joi.string(),
    deadline: Joi.date().iso(),
    state: Joi.string().valid('Not started', 'In progress', 'Done', 'Abandoned'),
    _embedded: Joi.object().keys({
        barmen: AssociationChangesSchema,
        kommissions: AssociationChangesSchema,
    })
});

module.exports = {
    Task,
    TaskSchema
};
