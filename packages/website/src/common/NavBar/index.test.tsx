import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import HomePageNavBar from ".";

jest.mock("../../routes/Homepage/RegisterDialog", () => "Mock-RegisterDialog");
jest.mock("../../routes/Homepage/SignInDialog", () => "Mock-SignInDialog");
jest.mock("../Search", () => "Mock-Search");
jest.mock("../MenuDrawer", () => "Mock-MenuDrawer");

const mockStore = configureStore([]);

describe("NavBar", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const store = mockStore({
      user: {
        userInfo: null,
        loading: false,
        error: null,
      },
    });

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <HomePageNavBar searchLocation={false} />
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
