import React from "react";
import { render } from "@testing-library/react";

import Tooltip from ".";

test("renders as expected", () => {
  const tooltipData = {
    date: "",
    depth: 0,
    bottomTemperature: 0,
    surfaceTemperature: 0,
  };
  const { container } = render(<Tooltip {...tooltipData} />);
  expect(container).toMatchSnapshot();
});
