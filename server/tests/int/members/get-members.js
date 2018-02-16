const { BASE_URL, baseRequest } = require('../utils/setup');
const { Member } = require('../../../app/models');

describe('Integration::Members::GetMembers', () => {

    test('should return members in array', async () => {
        // Given

        await Member.bulkCreate([
            {
                firstName: 'John',
                lastName: 'Smith',
                school: 'INSA',
                // TODO test active filter
            }
        ]);

        // When

        const members = await baseRequest.get(BASE_URL + '/members');

        // Then

        expect(members).toEqual([
                expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Smith',
                    school: 'INSA',
                    active: true
                })
            ]
        );
    });
});
