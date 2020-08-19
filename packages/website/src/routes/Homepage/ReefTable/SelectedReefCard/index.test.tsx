import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import SelectedReefCard from ".";
import { Reef } from "../../../../store/Reefs/types";

jest.mock("react-chartjs-2", () => ({
  Line: () => "Mock-Line",
  Chart: {
    pluginService: {
      register: jest.fn(),
    },
  },
}));

test("renders as expected", () => {
  const reef: Reef = {
    id: 0,
    name: "",
    polygon: {
      coordinates: [0, 0],
      type: "Point",
    },
    maxMonthlyMean: 0,
    depth: 0,
    status: 0,
    videoStream: null,
    region: "",
    admin: null,
    stream: null,
    dailyData: [
      {
        id: 171,
        date: "2020-07-01T16:40:19.842Z",
        minBottomTemperature: 37,
        maxBottomTemperature: 39,
        avgBottomTemperature: 38,
        degreeHeatingDays: 34,
        surfaceTemperature: 29,
        satelliteTemperature: 23,
        minWaveHeight: 2,
        maxWaveHeight: 4,
        avgWaveHeight: 3,
        waveDirection: 205,
        wavePeriod: 28,
        minWindSpeed: 3,
        maxWindSpeed: 5,
        avgWindSpeed: 4,
        windDirection: 229,
      },
    ],
  };

  const { container } = render(
    <Router>
      <SelectedReefCard reef={reef} />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
