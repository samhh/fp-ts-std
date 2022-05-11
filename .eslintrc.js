module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "functional"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:functional/all",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "functional/prefer-tacit": 2,
    "functional/no-expression-statement": [
      2,
      { ignorePattern: "(describe)|(it)|(expect)|(fc.)|(laws.)" },
    ],
    // Tripped in Jest suites
    "functional/no-return-void": [2, { ignoreImplicit: true }],
    "functional/prefer-readonly-type": 0,
    "functional/functional-parameters": 0,
    "@typescript-eslint/prefer-regexp-exec": 0,
    "@typescript-eslint/array-type": [1, { default: "generic" }],
    // We'll have unused vars when testing types via declarations. This allows
    // them when prefixed with an underscore.
    "@typescript-eslint/no-unused-vars": [1, { varsIgnorePattern: "^_" }],
  },
}
