import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ReefFooter from ".";

test("renders as expected", () => {
  const { container } = render(
    <Router>
      <ReefFooter />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
