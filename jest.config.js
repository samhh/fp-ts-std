module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 87,
            functions: 75,
            lines: 94,
            statements: 86,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

