import type { GatsbyNode, Page, PluginOptions } from "gatsby";
import { translatePage } from "../onCreatePage";

const args = {
	actions: {
		createPage: jest.fn(),
		deletePage: jest.fn(),
	},
};

const getArgs = (
	path: string
): Parameters<NonNullable<GatsbyNode["onCreatePage"]>>[0] => {
	const page = { path };
	const result = {
		...args,
		page: page as unknown as Page<Record<string, unknown>>,
	};

	return result as unknown as Parameters<
		NonNullable<GatsbyNode["onCreatePage"]>
	>[0];
};

const options: PluginOptions = {
	defaultLocale: "et-EE",
	locales: [
		{
			locale: "et-EE",
			prefix: "ee",
		},
		{
			locale: "en-US",
			prefix: "en",
		},
	],
	plugins: [],
};

describe("translatePage()", () => {
	it("should return without options", () => {
		translatePage(getArgs("/"));
		expect(args.actions.deletePage).not.toHaveBeenCalled();
		expect(args.actions.createPage).not.toHaveBeenCalled();
	});

	it("should delete existing page and recreate with new context", () => {
		translatePage(getArgs("/"), options);
		expect(args.actions.deletePage).toHaveBeenCalled();
		expect(args.actions.createPage).toHaveBeenCalled();
	});
});
