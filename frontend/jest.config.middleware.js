module.exports = {
  ...require('./jest.config.js'),
  testEnvironment: 'node',
  testMatch: ['**/tests/middleware.test.ts'],
  testPathIgnorePatterns: [],
}; 