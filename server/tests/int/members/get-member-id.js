const { site, initDatabase, clearDatabase } = require('../../utils/setup-teardown-common');
const { Member } = require('../../../app/models');

beforeEach(initDatabase);
afterEach(clearDatabase);

describe('Integration::Members::GetMemberById', () => {
  test('noop', async () => {});
});
