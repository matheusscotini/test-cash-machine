module.exports = {
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/infra/**',
        '!<rootDir>/src/ui/**'
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    coveragePathIgnorePatterns: [
        '-error.ts$'
    ],
    testMatch: ['**/*.spec.ts'],
    roots: [
        '<rootDir>/src',
        '<rootDir>/test'
    ],
    transform: {
        '\\.ts$': 'ts-jest'
    },
    clearMocks: true,
    setupFiles: ['dotenv/config']
}
