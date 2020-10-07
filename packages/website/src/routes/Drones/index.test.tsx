import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";

import Drones from ".";

jest.mock("../../common/NavBar", () => "Mock-NavBar");
jest.mock("../../common/Footer", () => "Mock-Footer");

const mockStore = configureStore([]);
describe("Drones", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const store = mockStore({
      user: {
        userInfo: null,
        loading: false,
        error: null,
      },
      reefsList: {
        list: [],
      },
    });

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <Router>
          <Drones />
        </Router>
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
