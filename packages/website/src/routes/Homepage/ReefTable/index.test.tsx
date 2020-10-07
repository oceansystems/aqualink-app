import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ReefTable from ".";

jest.mock("./SelectedReefCard", () => "Mock-SelectedReefCard");

const mockStore = configureStore([]);

describe("ReefTable", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const reef = {
      id: 1,
      name: "Mock Reef Hartmann",
      polygon: {
        type: "Point",
        coordinates: [-39.7, -89.7],
      },
      maxMonthlyMean: 5,
      depth: 19,
      status: 0,
      videoStream: null,
      region: { name: "Hawai" },
      admin: null,
      stream: null,
      latestDailyData: {
        weeklyAlertLevel: 3,
        maxBottomTemperature: 10,
        degreeHeatingDays: 20,
      },
    };
    const store = mockStore({
      reefsList: {
        list: [reef],
        loading: false,
        error: null,
      },
      selectedReef: {
        loading: false,
        error: null,
      },
      homepage: {
        reefOnMap: null,
      },
    });

    const openDrawer = false;

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <ReefTable openDrawer={openDrawer} />
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
