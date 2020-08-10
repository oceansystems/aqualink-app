/* eslint-disable no-underscore-dangle */
import React from "react";
import { render } from "@testing-library/react";

import Map from ".";

jest.mock("react-leaflet");

test("renders as expected", () => {
  const { container } = render(
    <Map
      polygon={{
        type: "Polygon",
        coordinates: [[[0, 0]]],
      }}
    />
  );
  expect(container).toMatchSnapshot();
});
