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
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        }, { sequelize });
    }


    /**
     * Set associations for the model
     * @param models
     */
    /*static associate(models) {
        //this.hasMany(models.Service, { as: 'services' });
    }*/
}

const CategorySchema = Joi.object().keys({
    name: Joi.string()
});


module.exports = {
    Category,
    CategorySchema
};
