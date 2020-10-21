module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 87,
            functions: 61,
            lines: 93,
            statements: 79,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

