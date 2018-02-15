const path = require('path');
const { SequelizeMocking } = require('sequelize-mocking');
const sequelize = require('../../../db');

const { getAllMembers } = require('../member-service');

describe('Member service Test', () => {
    let mockedInstance = null;

    beforeEach(async () => {
        mockedInstance = await SequelizeMocking.createAndLoadFixtureFile(
            sequelize,
            path.resolve(path.join(__dirname, '../../tests/resources/fake-members-database.json'))
        );
    });

    afterEach(() => SequelizeMocking.restore(mockedInstance));


    test('should return members in array', async () => {
        // Given
        // When

        const members = await getAllMembers();

        // Then

        expect(members).toHaveLength(2);
        expect(members).toEqual([
            expect.objectContaining({
                'id': 1,
                'firstName': 'John',
                'lastName': 'Doe',
                'school': 'INSA Lyon',
                'active': false

            }),
            expect.objectContaining({
                'id': 2,
                'firstName': 'John',
                'lastName': 'Smith',
                'school': 'MIT',
                'active': true

            })
        ]);
    });
});
