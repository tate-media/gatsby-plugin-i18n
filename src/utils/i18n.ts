import type { PluginOptions, PluginOptionsLocale } from "gatsby";
import { I18nContextTranslation } from "./context";

export const inferLocaleFromPath = (
	path: string,
	options: PluginOptions
): string => {
	const prefix = path.split("/")[1];

	return (
		options.locales.find((l) => l.prefix === prefix)?.locale ??
		options.defaultLocale
	);
};

export const getLocaleFromCode = (
	code: string,
	options: PluginOptions
): PluginOptionsLocale | undefined => {
	return (
		options.locales.find((l) => l.locale === code) ??
		options.locales.find((l) => l.locale === options.defaultLocale)
	);
};

export const getTranslatedSlugs = (
	locale: PluginOptionsLocale,
	options: PluginOptions
): Record<string, string> => {
	const translatedSlugs = { ...locale.slugs };

	if (locale.locale !== options.defaultLocale) {
		Object.entries(translatedSlugs).forEach(([key, value]) => {
			translatedSlugs[key] = `/${locale.prefix}${value}`;
		});
	}

	return translatedSlugs;
};

export const getTranslationsFromPath = (
	path: string,
	options: PluginOptions
): I18nContextTranslation[] => {
	const inferredLocaleCode = inferLocaleFromPath(path, options);
	const inferredLocale = getLocaleFromCode(inferredLocaleCode, options);

	if (!inferredLocale) return [];

	const translations: I18nContextTranslation[] = [];

	options.locales
		.filter((l) => l.locale !== inferredLocaleCode)
		.forEach((l) => {
			let translatedPath = "";

			const inferredLocaleSlugs = getTranslatedSlugs(inferredLocale, options);
			const defaultSlug = Object.entries(inferredLocaleSlugs).find(
				(entry) => entry[1] === path
			)?.[0];
			if (defaultSlug) {
				const currentLocaleSlugs = getTranslatedSlugs(l, options);
				translatedPath = currentLocaleSlugs[defaultSlug] ?? `/${l.prefix}/`;
			} else if (l.locale !== options.defaultLocale) {
				translatedPath = `/${l.prefix}/`;
			} else {
				translatedPath = "/";
			}

			translations.push({
				locale: l.locale,
				path: translatedPath,
			});
		});

	return translations;
};
