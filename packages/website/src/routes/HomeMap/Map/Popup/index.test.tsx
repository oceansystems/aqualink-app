import React from "react";
import { render } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import Popup from ".";
import { mockReef } from "../../../../mocks/mockReef";

jest.mock("react-leaflet", () => ({
  __esModule: true,
  Popup: (props: any) =>
    jest.requireActual("react").createElement("mock-LeafletPopup", props),
}));

test("renders as expected", () => {
  const { container } = render(
    <Router>
      <Popup reef={mockReef} />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
