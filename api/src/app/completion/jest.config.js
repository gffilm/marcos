module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  reporters: ['default', 'github-actions'],
  coverageReporters: ['json', 'text'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/tests/**'
  ]
}
