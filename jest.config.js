module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*'],
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 90,
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

