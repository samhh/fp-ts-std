module.exports = {
	collectCoverageFrom: ["./src/**/*"],
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
}
