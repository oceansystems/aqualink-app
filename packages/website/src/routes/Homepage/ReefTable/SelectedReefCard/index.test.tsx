import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import SelectedReefCard from ".";

jest.mock("react-chartjs-2", () => ({
  Line: () => "Mock-Line",
  Chart: {
    pluginService: {
      register: jest.fn(),
    },
  },
}));

const reef = {
  details: {
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
    region: "",
    admin: null,
    stream: null,
    liveData: {
      reef: { id: 1 },
      date: "2020-07-01T14:25:18.008Z",
      bottomTemperature: {
        value: 39,
        timestamp: "2020-07-01T14:25:18.008Z",
      },
      satelliteTemperature: {
        value: 29,
        timestamp: "2020-07-01T14:25:18.008Z",
      },
      degreeHeatingDays: {
        value: 34,
        timestamp: "2020-07-01T14:25:18.008Z",
      },
    },
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
  },
};

const mockStore = configureStore([]);

const store = mockStore({
  selectedReef: reef,
  homepage: {
    reefOnMap: reef,
  },
  surveyList: {
    list: [],
  },
});

store.dispatch = jest.fn();

test("renders as expected", () => {
  process.env.REACT_APP_FEATURED_REEF_ID = "2";

  const { container } = render(
    <Provider store={store}>
      <Router>
        <SelectedReefCard />
      </Router>
    </Provider>
  );
  expect(container).toMatchSnapshot();
});

test("renders loading as expected", () => {
  process.env.REACT_APP_FEATURED_REEF_ID = "4";
  const { container } = render(
    <Provider store={store}>
      <Router>
        <SelectedReefCard />
      </Router>
    </Provider>
  );
  expect(container).toMatchSnapshot();
});
