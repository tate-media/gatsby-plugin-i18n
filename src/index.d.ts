import { PluginOptions as GatsbyPluginOptions } from "gatsby";

declare module "gatsby" {
	interface PluginOptionsLocaleUniversalMessages
		extends Record<string, string> {
		localeCode: string;
		localeName: string;
	}

	interface PluginOptionsLocale {
		locale: string;
		localMessages: Record<string, string>;
		prefix: string;
		slugs?: Record<string, string>;
		universalMessages: PluginOptionsLocaleUniversalMessages;
	}

	export interface PluginOptions extends GatsbyPluginOptions {
		defaultLocale: string;
		locales: PluginOptionsLocale[];
		siteUrl: string;
	}
}
