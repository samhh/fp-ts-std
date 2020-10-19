const tsconfig = require('./tsconfig.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '\/test\/',
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};

