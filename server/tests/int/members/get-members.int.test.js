const { setup, request, teardown } = require('../../utils/setup-teardown-common');
const { Member, Registration } = require('../../../app/models');
const { getCurrentSchoolYear } = require('../../../utils');

beforeEach(setup);
afterEach(teardown);

describe('Integration::Members::GetMembers', () => {
  test('should return members in array', async () => {
    // Given
    await Member.create(
      {
        firstName: 'John',
        lastName: 'Smith',
        school: 'INSA',
        registrations: [{ year: getCurrentSchoolYear() }],
      },
      {
        include: [{ model: Registration, as: 'registrations' }],
      },
    );

    // When

    const { body: members } = await request().get('/api/members').expect(200);

    // Then

    expect(members).toEqual([
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Smith',
        school: 'INSA',
        registrations: expect.arrayContaining([{
          year: getCurrentSchoolYear(),
          createdAt: expect.anything(),
        }]),
      }),
    ]);
  });


  test('should return empty array if not registered for the current year', async () => {
    // Given
    await Member.create(
      {
        firstName: 'John',
        lastName: 'Smith',
        school: 'INSA',
        registrations: [{ year: getCurrentSchoolYear() - 1 }],
      },
      {
        include: [{ model: Registration, as: 'registrations' }],
      },
    );

    // When

    const { body: members } = await request().get('/api/members').expect(200);

    // Then

    expect(members).toEqual([]);
  });
});
