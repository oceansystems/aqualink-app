import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ReefTable from ".";

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
      region: null,
      admin: null,
      stream: null,
      latestDailyData: {
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
    });

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <ReefTable />
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
