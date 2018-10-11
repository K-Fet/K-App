const { setup, request, teardown } = require('../../utils/setup-teardown-common');
const { Member, Registration } = require('../../../app/models');
const { getCurrentSchoolYear } = require('../../../utils');

const CURRENT_SCHOOL_YEAR = getCurrentSchoolYear();

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
        registrations: [{ year: CURRENT_SCHOOL_YEAR }],
      },
      {
        include: [{ model: Registration, as: 'registrations' }],
      },
    );

    // When

    const { body: members } = await request()
      .get(`/api/members?startAt=${CURRENT_SCHOOL_YEAR}&endAt=${CURRENT_SCHOOL_YEAR + 1}`)
      .expect(200);

    // Then

    expect(members).toEqual([
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Smith',
        school: 'INSA',
        registrations: expect.arrayContaining([{
          year: CURRENT_SCHOOL_YEAR,
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
        registrations: [{ year: CURRENT_SCHOOL_YEAR - 1 }],
      },
      {
        include: [{ model: Registration, as: 'registrations' }],
      },
    );

    // When

    const { body: members } = await request()
      .get(`/api/members?startAt=${CURRENT_SCHOOL_YEAR}&endAt=${CURRENT_SCHOOL_YEAR + 1}`)
      .expect(200);

    // Then

    expect(members).toEqual([]);
  });
});
