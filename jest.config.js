const tsconfig = require('./tsconfig.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 50,
            lines: 92,
            statements: 73,
        },
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

