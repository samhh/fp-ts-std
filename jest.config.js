module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 58,
            lines: 93,
            statements: 78,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

