import React from "react";
import { render } from "@testing-library/react";
import Apply from ".";

jest.mock("../../common/NavBar", () => "Mock-NavBar");
jest.mock("./LocationMap", () => "Mock-LocationMap");

test("renders as expected", () => {
  const { container } = render(<Apply />);
  expect(container).toMatchSnapshot();
});
