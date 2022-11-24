import { I18nContext, I18nContextValues } from "../context";
import { render, screen } from "@testing-library/react";
import type { PageProps } from "gatsby";
import React from "react";
import { useIntl } from "react-intl";
import { wrapPageElement } from "../wrapPageElement";

const options = {
	defaultLocale: "et-EE",
	locales: [
		{
			locale: "et-EE",
			localMessages: {
				test: "Testsõnum",
			},
			prefix: "ee",
			slugs: {
				"/meist/": "/meist/",
				"/kontakt/": "/kontakt/",
			},
		},
		{
			locale: "en-US",
			localMessages: {
				test: "Test message",
			},
			prefix: "en",
			slugs: {
				"/meist/": "/about/",
			},
		},
		{
			locale: "de-CH",
			prefix: "de",
			slugs: {
				"/meist/": "/ueber/",
			},
		},
	],
	plugins: [],
};

const props = {
	pageContext: {
		locale: "en-US",
	},
};

interface TestIntlProps {
	messagesCount?: boolean;
}

const TestIntl: React.FC<TestIntlProps> = ({ messagesCount }) => {
	const intl = useIntl();

	if (messagesCount)
		return <p>Messages count: {Object.keys(intl.messages).length}</p>;

	return <p>{intl.formatMessage({ id: "test" })}</p>;
};

describe("wrapPageElement()", () => {
	it("should create an I18nContext and set up react-intl", () => {
		const element = (
			<I18nContext.Consumer>
				{(contextValues) => (
					<>
						<p>Locale: {contextValues.locale}</p>
						<TestIntl />
					</>
				)}
			</I18nContext.Consumer>
		);
		render(
			wrapPageElement(
				{
					element,
					props: props as unknown as PageProps<
						Record<string, unknown>,
						I18nContextValues
					>,
				},
				options
			)
		);

		expect(screen.getByText("Locale: en-US")).toBeInTheDocument();
		expect(screen.getByText("Test message")).toBeInTheDocument();
	});

	it("should set locale to default when not present", () => {
		const element = (
			<I18nContext.Consumer>
				{(contextValues) => (
					<>
						<p>Locale: {contextValues.locale}</p>
						<TestIntl />
					</>
				)}
			</I18nContext.Consumer>
		);
		render(
			wrapPageElement(
				{
					element,
					props: { pageContext: {} } as unknown as PageProps<
						Record<string, unknown>,
						I18nContextValues
					>,
				},
				options
			)
		);

		expect(screen.getByText("Locale: et-EE")).toBeInTheDocument();
		expect(screen.getByText("Testsõnum")).toBeInTheDocument();
	});

	it("should send empty object as messages when not set in options", () => {
		const element = (
			<I18nContext.Consumer>
				{(contextValues) => (
					<>
						<p>Locale: {contextValues.locale}</p>
						<TestIntl messagesCount={true} />
					</>
				)}
			</I18nContext.Consumer>
		);
		render(
			wrapPageElement(
				{
					element,
					props: { pageContext: { locale: "de-CH" } } as unknown as PageProps<
						Record<string, unknown>,
						I18nContextValues
					>,
				},
				options
			)
		);

		expect(screen.getByText("Locale: de-CH")).toBeInTheDocument();
		expect(screen.getByText("Messages count: 0")).toBeInTheDocument();
	});
});
