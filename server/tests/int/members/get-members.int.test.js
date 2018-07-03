const { setup, request, teardown } = require('../../utils/setup-teardown-common');
const { Member } = require('../../../app/models');

beforeEach(setup);
afterEach(teardown);

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

    const { body: members } = await request().get('/api/members').expect(200);

    // Then

    expect(members).toEqual([
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Smith',
        school: 'INSA',
        active: true,
      }),
    ]);
  });


  test('should return empty array', async () => {
    // Given
    // When

    const { body: members } = await request().get('/api/members').expect(200);

    // Then

    expect(members).toEqual([]);
  });
});
