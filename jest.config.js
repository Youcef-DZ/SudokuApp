module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|expo|@expo|@testing-library)/)',
    ],
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/__tests__/**',
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 60,
            statements: 60,
        },
    },
};
