const fs = require('fs').promises;
const { run } = require('../backup');
const utils = require('../utils');

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(() => []),
    stat: jest.fn(() => ({ mtimeMs: 0 })),
    unlink: jest.fn(),
  },
}));

jest.mock('../utils');

beforeAll(() => {
  process.env = {
    ...process.env,
    DB__HOST: 'host',
    DB__USERNAME: 'username',
    DB__PASSWORD: 'password',
    DB__DATABASE: 'database',
    BACKUP_DIR: 'dir',
    KEEP_BACKUPS_FOR: 1, // One day
  };
});

afterEach(() => {
  Object.values(fs).forEach(m => m.mockReset());
});


it('should delete old databases', async () => {
  // Given
  fs.readdir.mockImplementationOnce(() => [
    '1.sql.gz',
    '2.sql.gz',
    '3.sql.gz',
    '4.sql.gz',
    '5.sql.gz',
    '6.sql.gz',
  ]);
  fs.stat.mockImplementation((name) => {
    const index = +name.charAt(4); // Backup dir is joined with the file name
    const twoDays = 1000 * 60 * 60 * 24 * 2;
    return {
      // 1-3 should be deleted 4-6 no
      mtimeMs: Date.now() + (index <= 3 ? -twoDays : 0),
      file: name,
    };
  });

  // When
  await run();

  expect(fs.unlink).toHaveBeenNthCalledWith(1, '1.sql.gz');
  expect(fs.unlink).toHaveBeenNthCalledWith(2, '2.sql.gz');
  expect(fs.unlink).toHaveBeenNthCalledWith(3, '3.sql.gz');
});

it('should execute mysql dump with all parameters', async () => {
  // Given
  fs.readdir.mockImplementationOnce(() => []);

  // When
  await run();

  expect(utils.exec).toHaveBeenCalledWith(
    expect.stringMatching(/^(?=.*\bmysqldump\b)(?=.*\bpassword\b)(?=.*\busername\b)(?=.*\bdatabase\b).+/));
});
