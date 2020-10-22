module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 99,
            lines: 99,
            statements: 99,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

