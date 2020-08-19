import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import Search from ".";

const mockStore = configureStore([]);

describe("Search", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const store = mockStore({
      reefsList: {
        list: [],
        loading: false,
        error: null,
      },
    });

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <Search />
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
