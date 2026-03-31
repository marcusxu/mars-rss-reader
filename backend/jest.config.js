module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    testMatch: ['<rootDir>/test/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            useESM: false,
        }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))'
    ],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/**/*.interface.ts',
        '!src/main.ts',
    ],
    coverageDirectory: 'coverage',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
};