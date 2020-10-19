module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'functional'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:functional/all',
    ],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        'functional/no-expression-statement': [2, { ignorePattern: 'suite.run' }],
        'functional/prefer-readonly-type': 0,
        'functional/functional-parameters': 0,
    },
};

