import React from "react";

export interface I18nContextTranslation {
	locale?: string;
	path?: string;
}

export interface I18nContextValues {
	locale?: string;
	prefix?: string;
	translations?: I18nContextTranslation[];
}

export const I18nContext = React.createContext<I18nContextValues>({});
