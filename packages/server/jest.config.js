const path = require('path');

module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: [
    path.resolve(__dirname, 'tests/utils/configure.js'),
  ],
};
