module.exports = {
	testRegex: "/test/",
	collectCoverageFrom: ["./src/**/*"],
	coveragePathIgnorePatterns: ["index.ts"],
	coverageProvider: "v8",
	coverageThreshold: {
		global: {
			// Principally 100%, but coverage is reported inconsistently across
			// platforms, so we'll give it a little wiggle room here.
			branches: 99,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	transform: {
		"\\.ts$": ["@swc/jest"],
	},
}
