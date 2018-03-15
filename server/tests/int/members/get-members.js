const { site, initDatabase, clearDatabase } = require('../../utils/setup-teardown-common');
const { Member } = require('../../../app/models');

beforeEach(initDatabase);
afterEach(clearDatabase);

describe('Integration::Members::GetMembers', () => {

    test('should return members in array', async () => {
        // Given

        await Member.bulkCreate([
            {
                firstName: 'John',
                lastName: 'Smith',
                school: 'INSA',
                // TODO test active filter
            },
        ]);

        // When

        const members = await site.baseRequest.get(`${site.BASE_URL}/members`);

        // Then

        expect(members).toEqual(
            [
                expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Smith',
                    school: 'INSA',
                    active: true,
                }),
            ],
        );
    });


    test('should return empty array', async () => {
        // Given
        // When

        const members = await site.baseRequest.get(`${site.BASE_URL}/members`);

        // Then

        expect(members).toEqual([]);
    });
});
