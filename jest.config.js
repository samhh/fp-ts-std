module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 56,
            lines: 93,
            statements: 77,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

