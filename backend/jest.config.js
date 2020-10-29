module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: true,
  clearMocks: true,
  collectCoverageFrom: ["src/**", "!src/migrations/**"],
  coverageDirectory: '__tests__/coverage',
};