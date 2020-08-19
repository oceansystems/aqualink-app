import React from "react";
import { render } from "@testing-library/react";

import Sensor from ".";
import type { Reef } from "../../../../store/Reefs/types";

test("renders as expected", () => {
  const dailyData = [
    {
      id: 1,
      date: "2020-07-01T14:25:18.008Z",
      minBottomTemperature: 25,
      maxBottomTemperature: 27,
      avgBottomTemperature: 26,
      degreeHeatingDays: 29,
      surfaceTemperature: 36,
      satelliteTemperature: 20,
      minWaveHeight: 1,
      maxWaveHeight: 3,
      avgWaveHeight: 2,
      waveDirection: 136,
      wavePeriod: 15,
      minWindSpeed: 3,
      maxWindSpeed: 5,
      avgWindSpeed: 4,
      windDirection: 96,
    },
  ];

  const reef: Reef = {
    id: 16,
    name: "Mock Reef Friesen",
    temperatureThreshold: 25,
    depth: 24,
    status: 1,
    videoStream: null,
    region: null,
    admin: null,
    stream: null,
    dailyData,
    polygon: {
      type: "Point",
      coordinates: [0, 0],
    },
  };

  const { container } = render(<Sensor reef={reef} />);
  expect(container).toMatchSnapshot();
});
