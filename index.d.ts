import React from "react";

declare module "@tate-media/gatsby-plugin-i18n" {
	export interface I18nContextTranslation {
		locale?: string;
		path?: string;
	}

	export interface I18nContextValues {
		locale?: string;
		prefix?: string;
		translations?: I18nContextTranslation[];
	}

	export const I18nContext: React.Context<I18nContextValues>;
}
