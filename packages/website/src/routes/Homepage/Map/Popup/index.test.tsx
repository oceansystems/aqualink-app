import React from "react";
import { render } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import Popup from ".";
import { Reef } from "../../../../store/Reefs/types";

jest.mock("react-leaflet", () => ({
  __esModule: true,
  Popup: (props: any) =>
    jest.requireActual("react").createElement("mock-LeafletPopup", props),
}));

test("renders as expected", () => {
  const reef: Reef = {
    id: 2,
    name: "",
    polygon: {
      coordinates: [0, 0],
      type: "Point",
    },
    maxMonthlyMean: 0,
    depth: 0,
    status: 0,
    videoStream: null,
    region: { name: "Hawai" },
    admin: null,
    stream: null,
    dailyData: [],
    latestDailyData: {
      id: 10,
      date: "",

      minBottomTemperature: 10,
      maxBottomTemperature: 10,
      avgBottomTemperature: 10,

      degreeHeatingDays: 10,
      surfaceTemperature: 10,
      satelliteTemperature: 10,

      minWindSpeed: 10,
      maxWindSpeed: 10,
      avgWindSpeed: 10,
      windDirection: 10,

      minWaveHeight: 10,
      maxWaveHeight: 10,
      avgWaveHeight: 10,
      waveDirection: 10,
      wavePeriod: 10,
    },
  };

  const { container } = render(
    <Router>
      <Popup reef={reef} />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
