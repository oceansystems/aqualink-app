import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";
import ReefNavBar from ".";

import { mockReef } from "../../../../mocks/mockReef";
import { mockUser } from "../../../../mocks/mockUser";

const mockStore = configureStore([]);

describe("ReefNavBar", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const store = mockStore({
      user: {
        userInfo: mockUser,
      },
      reefsList: {
        list: [mockReef],
      },
    });
    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <Router>
          <ReefNavBar
            hasDailyData
            reef={mockReef}
            isAdmin
            lastSurvey="2020-09-10T10:27:00.000Z"
          />
        </Router>
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
