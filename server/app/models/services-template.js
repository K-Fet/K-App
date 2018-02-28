const { DataTypes, Model } = require('sequelize');

/**
 * This class represents a template for a list of services for a week.
 */
class ServicesTemplate extends Model {

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

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) {
        this.hasMany(models.ServicesTemplateUnit, { as: 'services' });
    }
}

/**
 * This class represent an unique service for a template.
 */
class ServicesTemplateUnit extends Model {

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
            nbMax: {
                type: DataTypes.INTEGER,
                validate: { min: 1 },
            },

            startAt: {
                type: DataTypes.DATE,
                allowNull: false,
                // eslint-disable-next-line
                get() {
                    const startAt = this.getDataValue('startAt');

                    return {
                        day: startAt.getDay(),
                        hours: startAt.getHours(),
                        minutes: startAt.getMinutes(),
                    };
                },
                // eslint-disable-next-line
                set(val) {
                    const date = new Date();
                    const currDay = date.getDay();

                    date.setDate(date.getDate() + (val.day - currDay));
                    date.setHours(val.hours);
                    date.setMinutes(val.minutes);

                    this.setDataValue('startAt', date);
                },
            },

            endAt: {
                type: DataTypes.DATE,
                allowNull: false,
                // eslint-disable-next-line
                get() {
                    const endAt = this.getDataValue('endAt');

                    return {
                        day: endAt.getDay(),
                        hours: endAt.getHours(),
                        minutes: endAt.getMinutes(),
                    };
                },
                // eslint-disable-next-line
                set(val) {
                    const date = new Date();
                    const currDay = date.getDay();

                    date.setDate(date.getDate() + (val.day - currDay));
                    date.setHours(val.hours);
                    date.setMinutes(val.minutes);

                    this.setDataValue('endAt', date);
                },
            },
        }, {
            sequelize,
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) { // eslint-disable-line no-unused-vars
    }
}

module.exports = {
    ServicesTemplate,
    ServicesTemplateUnit,
};
