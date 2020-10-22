module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 87,
            functions: 77,
            lines: 95,
            statements: 87,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

