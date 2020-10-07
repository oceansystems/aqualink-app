import React from "react";
import { render } from "@testing-library/react";

import Waves from ".";

test("renders as expected", () => {
  const liveData = {
    reef: { id: 1 },
    date: "2020-07-01T14:25:18.008Z",
    bottomTemperature: {
      value: 25,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    satelliteTemperature: {
      value: 26,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    degreeHeatingDays: {
      value: 29,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    waveHeight: {
      value: 3,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    waveDirection: {
      value: 136,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    wavePeriod: {
      value: 15,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    windSpeed: {
      value: 5,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
    windDirection: {
      value: 96,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
  };
  const { container } = render(<Waves liveData={liveData} />);
  expect(container).toMatchSnapshot();
});
