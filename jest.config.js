const cfg = {
  testRegex: "/test/",
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*"],
  coveragePathIgnorePatterns: ["index.ts"],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    "\\.ts$": ["@swc/jest"],
  },
  moduleNameMapper: {
    // https://github.com/swc-project/jest/issues/64#issuecomment-1029753225
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
}

export default cfg
