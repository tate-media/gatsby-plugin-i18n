import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{ts,tsx}"],
	globals: {
		__PATH_PREFIX__: "",
	},
	moduleNameMapper: {
		".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
		".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
			"<rootDir>/__mocks__/file-mock.ts",
	},
	setupFiles: ["<rootDir>/jest/loadershim.ts"],
	setupFilesAfterEnv: ["<rootDir>/jest/setup-test-env.ts"],
	testEnvironment: "jsdom",
	testEnvironmentOptions: {
		url: "http://localhost",
	},
	testPathIgnorePatterns: ["node_modules", "\\.cache", "<rootDir>/public"],
	transform: {
		"^.+\\.(t|j)sx?$": "<rootDir>/jest/preprocess.ts",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)",
	],
};

export default config;
