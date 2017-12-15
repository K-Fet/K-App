const { DataTypes } = require('sequelize');

module.exports = {
    fixDataTypes(sequelizeInstance) {
        // Fix UUID bug, see https://github.com/rochejul/sequelize-mocking/issues/16
        sequelizeInstance.modelManager.all.forEach(model => {
            for (const att of Object.values(model.attributes)) {
                att.type = new DataTypes[att.type.key]();
            }
        });
    }
};
