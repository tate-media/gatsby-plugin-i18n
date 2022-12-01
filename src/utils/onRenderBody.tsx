import type { GatsbySSR } from "gatsby";
import type { I18nContextValues } from "./context";
import React from "react";

export const onRenderBody: GatsbySSR["onRenderBody"] = (
	{ loadPageDataSync, pathname, setHeadComponents, setHtmlAttributes },
	options
) => {
	if (!loadPageDataSync) return;

	const {
		result: { pageContext },
	} = loadPageDataSync(pathname) as {
		result: { pageContext: I18nContextValues };
	};
	const locale = pageContext.locale ?? options.defaultLocale;
	const translations = pageContext.translations || [];
	const siteUrl = options.siteUrl;

	setHtmlAttributes({ lang: locale });
	setHeadComponents([
		<link
			href={new URL(pathname, siteUrl).href}
			hrefLang={locale}
			key={"currentLocaleLink"}
			rel={"alternate"}
		/>,
		...translations.map((t) => (
			<link
				href={new URL(t.path || "/", siteUrl).href}
				hrefLang={t.locale}
				key={`translatedLocaleLink-${t.locale}`}
				rel={"alternate"}
			/>
		)),
	]);
};
