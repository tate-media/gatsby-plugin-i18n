import {
	getLocaleFromCode,
	getTranslatedSlugs,
	getTranslationsFromPath,
	inferLocaleFromPath,
} from "../i18n";

const options = {
	defaultLocale: "et-EE",
	locales: [
		{
			locale: "et-EE",
			prefix: "ee",
			slugs: {
				"/meist/": "/meist/",
				"/kontakt/": "/kontakt/",
			},
		},
		{
			locale: "en-US",
			prefix: "en",
			slugs: {
				"/meist/": "/about/",
			},
		},
	],
	plugins: [],
};

describe("inferLocaleFromPath()", () => {
	it("should default to defaultLocale", () => {
		expect(inferLocaleFromPath("", options)).toBe(options.defaultLocale);
	});

	it("should infer defaultLocale without prefix match", () => {
		expect(inferLocaleFromPath("/kodu/", options)).toBe(options.defaultLocale);
	});

	it("should infer locale based on known prefixes", () => {
		expect(inferLocaleFromPath("/en/about/", options)).toBe("en-US");
		expect(inferLocaleFromPath("/et/kodu/", options)).toBe("et-EE");
	});
});

describe("getLocaleFromCode()", () => {
	it("should default to defaultLocale", () => {
		expect(getLocaleFromCode("x-default", options)).toBe(options.locales[0]);
	});

	it("should get locale based on matching code", () => {
		expect(getLocaleFromCode("et-EE", options)).toBe(options.locales[0]);
		expect(getLocaleFromCode("en-US", options)).toBe(options.locales[1]);
	});
});

describe("getTranslatedSlugs()", () => {
	it("should default to empty object", () => {
		expect(getTranslatedSlugs({}, options)).toStrictEqual({});
	});

	it("should get prefixed slugs", () => {
		expect(getTranslatedSlugs(options.locales[0], options)).toStrictEqual(
			options.locales[0].slugs
		);

		const enSlugs = getTranslatedSlugs(options.locales[1], options);
		expect(enSlugs).not.toStrictEqual(options.locales[1].slugs);
		expect(enSlugs).toStrictEqual({
			"/meist/": "/en/about/",
		});
	});
});

describe("getTranslationsFromPath()", () => {
	it("should return empty array for no inferred locale", () => {
		expect(
			getTranslationsFromPath("/", {
				...options,
				defaultLocale: "de-CH",
			})
		).toStrictEqual([]);
	});

	it("should return empty array if there is only one locale", () => {
		expect(
			getTranslationsFromPath("/", {
				...options,
				locales: [options.locales[0]],
			})
		).toStrictEqual([]);
	});

	it("should add translation for every available locale", () => {
		expect(getTranslationsFromPath("/", options)).toStrictEqual([
			{
				locale: "en-US",
				path: "/en/",
			},
		]);

		expect(getTranslationsFromPath("/meist/", options)).toStrictEqual([
			{
				locale: "en-US",
				path: "/en/about/",
			},
		]);

		expect(getTranslationsFromPath("/en/", options)).toStrictEqual([
			{
				locale: "et-EE",
				path: "/",
			},
		]);

		expect(getTranslationsFromPath("/en/about/", options)).toStrictEqual([
			{
				locale: "et-EE",
				path: "/meist/",
			},
		]);
	});

	it("should default to translations home for untranslated slugs", () => {
		expect(getTranslationsFromPath("/kontakt/", options)).toStrictEqual([
			{
				locale: "en-US",
				path: "/en/",
			},
		]);
	});
});
