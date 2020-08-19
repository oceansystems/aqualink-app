import React from "react";
import { render } from "@testing-library/react";

import Wind from ".";

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
  const { container } = render(<Wind dailyData={dailyData} />);
  expect(container).toMatchSnapshot();
});
