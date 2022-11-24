import { render, screen } from "@testing-library/react";
import { I18nContext } from "../context";
import React from "react";

describe("<I18nContext>", () => {
	it("should work as react context", () => {
		render(
			<I18nContext.Provider value={{ locale: "et-EE" }}>
				<I18nContext.Consumer>
					{(values) => <p>{values.locale}</p>}
				</I18nContext.Consumer>
			</I18nContext.Provider>
		);

		expect(screen.getByText("et-EE")).toBeInTheDocument();
	});
});
