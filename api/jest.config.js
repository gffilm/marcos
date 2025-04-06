module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
    '^.+\\.jsx?$': 'babel-jest', // If you have JavaScript files with JSX/ES6 modules
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [
    "/node_modules/",
  ],
};