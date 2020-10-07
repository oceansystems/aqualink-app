/* eslint-disable fp/no-mutation */
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";
import type { Reef as ReefType, Data } from "../../../store/Reefs/types";
import Reef from ".";

const mockStore = configureStore([]);

jest.mock("./Map", () => "Mock-Map");
jest.mock("./FeaturedMedia", () => "Mock-FeaturedMedia");
jest.mock("./Charts", () => "Mock-Charts");

describe("Reef Detail Page", () => {
  let elementEmpty: HTMLElement;
  let elementFull: HTMLElement;
  beforeEach(() => {
    const dailyData: Data = {
      id: 1,
      date: "20 May 2020",
      minBottomTemperature: 20,
      maxBottomTemperature: 30,
      avgBottomTemperature: 25,
      degreeHeatingDays: 1,
      surfaceTemperature: 25,
      satelliteTemperature: 26,
      minWindSpeed: 10,
      maxWindSpeed: 9,
      avgWindSpeed: 11,
      windDirection: 180,
      minWaveHeight: 3,
      maxWaveHeight: 5,
      avgWaveHeight: 4,
      waveDirection: 180,
      wavePeriod: 2,
    };

    const reef: ReefType = {
      id: 1,
      name: null,
      polygon: {
        type: "Polygon",
        coordinates: [[[0, 0]]],
      },
      maxMonthlyMean: 22,
      depth: 4,
      status: 1,
      region: "Hawaii",
      videoStream: null,
      stream: null,
      admin: null,
      dailyData: [],
      latestDailyData: dailyData,
    };

    const emptyStore = mockStore({
      selectedReef: {
        details: reef,
        loading: false,
        error: null,
      },
      user: {
        userInfo: null,
        error: null,
        loading: false,
      },
      reefsList: {
        list: [],
        loading: false,
        error: null,
      },
      surveyList: {
        list: [],
        loading: false,
        error: null,
      },
    });

    const fullStore = mockStore({
      selectedReef: {
        details: {
          ...reef,
          dailyData: [dailyData],
        },
        loading: false,
        error: null,
      },
      user: {
        userInfo: null,
        error: null,
        loading: false,
      },
      reefsList: {
        list: [],
        loading: false,
        error: null,
      },
      surveyList: {
        list: [],
        loading: false,
        error: null,
      },
    });

    emptyStore.dispatch = jest.fn();
    fullStore.dispatch = jest.fn();

    const mockMatch = {
      isExact: true,
      params: {
        id: "1",
      },
      path: "/reefs/:id",
      url: "/reefs/1",
    };

    elementEmpty = render(
      <Provider store={emptyStore}>
        <Router>
          <Reef match={mockMatch} location={{} as any} history={{} as any} />
        </Router>
      </Provider>
    ).container;

    elementFull = render(
      <Provider store={fullStore}>
        <Router>
          <Reef match={mockMatch} location={{} as any} history={{} as any} />
        </Router>
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(elementEmpty).toMatchSnapshot("snapshot-with-no-data");
  });

  it("should render with given state from Redux store", () => {
    expect(elementFull).toMatchSnapshot("snapshot-with-data");
  });
});
