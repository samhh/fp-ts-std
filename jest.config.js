module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*'],
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            branches: 96,
            functions: 91,
            lines: 78,
            statements: 78,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

