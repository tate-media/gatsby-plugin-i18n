import type { GatsbyNode } from "gatsby";
import { translatePage } from "./src/utils/onCreatePage";

export const onCreatePage: GatsbyNode["onCreatePage"] = async (args, options) =>
	await translatePage(args, options);

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({
	Joi,
}) =>
	Joi.object({
		defaultLocale: Joi.string().required().description("default locale"),
		locales: Joi.array()
			.required()
			.items(
				Joi.object({
					locale: Joi.string().required().description("locale code"),
					localMessages: Joi.object()
						.required()
						.description("translated messages"),
					prefix: Joi.string().required().description("slug prefix"),
					slugs: Joi.object().description("translated slug map"),
					universalMessages: Joi.object({
						localeCode: Joi.string()
							.required()
							.description("locale code for display"),
						localeName: Joi.string()
							.required()
							.description("locale name for display"),
					})
						.required()
						.description("univerally available translated messages"),
				})
			),
		siteUrl: Joi.string().required().description("site root url"),
	});
