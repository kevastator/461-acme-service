module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/'], // Ignore compiled files
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Output directory for coverage reports
  collectCoverageFrom: [
    'src/**/*.{js,ts}', // Include all JS and TS files in the src directory
    '!src/**/*.d.ts', // Exclude TypeScript definition files
    '!src/run.ts' // exclude main entrypoint.
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  coverageReporters: ["json", "json-summary"],
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  silent: true
};