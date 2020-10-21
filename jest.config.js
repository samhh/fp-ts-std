module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 87,
            functions: 67,
            lines: 94,
            statements: 82,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

