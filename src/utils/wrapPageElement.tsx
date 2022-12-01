import type {
	WrapPageElementBrowserArgs as GatsbyWrapPageElementBrowserArgs,
	WrapPageElementNodeArgs as GatsbyWrapPageElementNodeArgs,
	PluginOptions,
} from "gatsby";
import { I18nContext } from "./context";
import type { I18nContextValues } from "./context";
import { IntlProvider } from "react-intl";
import React from "react";
import { getLocaleFromCode } from "./i18n";

type WrapPageElementBrowserArgs = GatsbyWrapPageElementBrowserArgs<
	Record<string, unknown>,
	I18nContextValues,
	unknown
>;

type WrapPageElementNodeArgs = GatsbyWrapPageElementNodeArgs<
	Record<string, unknown>,
	I18nContextValues
>;

interface WrapPageElement {
	(
		args: WrapPageElementBrowserArgs,
		options: PluginOptions
	): React.ReactElement;
	(args: WrapPageElementNodeArgs, options: PluginOptions): React.ReactElement;
}

export const wrapPageElement: WrapPageElement = (
	{ element, props },
	options
) => {
	const { pageContext } = props;
	const { defaultLocale } = options;
	const locale = pageContext.locale || defaultLocale;
	const translations = pageContext.translations || [];

	const messages = getLocaleFromCode(locale, options)?.localMessages ?? {};

	options.locales.forEach((l) => {
		Object.entries(l.universalMessages || {}).forEach(([key, value]) => {
			messages[`${key}.${l.locale}`] = value;
		});
	});

	return (
		<I18nContext.Provider
			value={{
				locale,
				prefix: pageContext.prefix,
				translations,
			}}
		>
			<IntlProvider
				defaultLocale={defaultLocale}
				locale={locale}
				messages={messages}
			>
				{element}
			</IntlProvider>
		</I18nContext.Provider>
	);
};
