module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 87,
            functions: 84,
            lines: 96,
            statements: 91,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

