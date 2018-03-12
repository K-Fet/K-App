const { getAllMembers } = require('../member-service');

describe('Member service Test', async () => {

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
                'active': false,

            }),
            expect.objectContaining({
                'id': 2,
                'firstName': 'John',
                'lastName': 'Smith',
                'school': 'MIT',
                'active': true,

            }),
        ]);
    });
});
