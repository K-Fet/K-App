const { SequelizeMocking } = require('sequelize-mocking');
const sequelize = require('../../../db');

module.exports = {
    sequelizeMock(dataPath) {

        let mockedInstance = null;

        beforeEach(async () => {
            mockedInstance = await SequelizeMocking.createAndLoadFixtureFile(
                sequelize,
                dataPath
            );
        });

        afterEach(() => SequelizeMocking.restore(mockedInstance));
    }
};
