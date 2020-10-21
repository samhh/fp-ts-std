module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 87,
            functions: 66,
            lines: 94,
            statements: 81,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

