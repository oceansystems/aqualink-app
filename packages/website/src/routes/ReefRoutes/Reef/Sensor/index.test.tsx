import React from "react";
import { render } from "@testing-library/react";

import Sensor from ".";
import type { Reef } from "../../../../store/Reefs/types";

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
      value: 32,
      timestamp: "2020-07-01T14:25:18.008Z",
    },
  };

  const reef: Reef = {
    id: 16,
    name: "Mock Reef Friesen",
    maxMonthlyMean: 25,
    depth: 24,
    status: 1,
    videoStream: null,
    region: { name: "Hawai" },
    admin: null,
    stream: null,
    liveData,
    polygon: {
      type: "Point",
      coordinates: [0, 0],
    },
  };

  const { container } = render(<Sensor reef={reef} />);
  expect(container).toMatchSnapshot();
});
