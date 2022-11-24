import type { GatsbyNode, PluginOptions } from "gatsby";
import {
	getLocaleFromCode,
	getTranslationsFromPath,
	inferLocaleFromPath,
} from "./i18n";
import { I18nContextValues } from "./context";

interface OnCreatePage {
	(
		args: Parameters<NonNullable<GatsbyNode["onCreatePage"]>>[0],
		options?: PluginOptions
	): ReturnType<NonNullable<GatsbyNode["onCreatePage"]>>;
}

export const translatePage: OnCreatePage = (
	{ actions, page },
	options
): void => {
	if (!options) return;
	const { createPage, deletePage } = actions;
	const { path } = page;

	const inferredLocale = inferLocaleFromPath(path, options);

	const newContext: I18nContextValues = {
		locale: inferredLocale,
		prefix: getLocaleFromCode(inferredLocale, options)?.prefix,
		translations: getTranslationsFromPath(path, options),
	};

	deletePage(page);
	createPage({ ...page, context: { ...page.context, ...newContext } });
};
