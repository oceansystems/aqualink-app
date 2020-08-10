import React from "react";
import { render } from "@testing-library/react";

import Tooltip from ".";

test("renders as expected", () => {
  const tooltipData = {
    date: "",
    bottomTemperature: 0,
    surfaceTemperature: 0,
    wind: 0,
    windDirection: 0,
    wave: 0,
    wavePeriod: 0,
    waveDirection: 0,
  };
  const { container } = render(<Tooltip data={tooltipData} />);
  expect(container).toMatchSnapshot();
});
