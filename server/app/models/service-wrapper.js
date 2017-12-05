const { Model } = require('sequelize');

/**
 * This class is the joining table between a Service and a Barman.
 */
class ServiceWrapper extends Model {

    /**
     * Initialization function.
     *
     * @param sequelize
     * @returns {Model}
     */
    static init(sequelize) {
        return super.init({}, { sequelize });
    }


    /**
     * Set associations for the model
     * @param models there is not any associations
     */
    static associate(models) { // eslint-disable-line no-unused-vars
    }
}

module.exports = {
    ServiceWrapper
};
