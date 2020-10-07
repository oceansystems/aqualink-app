import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import DeleteButton from ".";

const mockStore = configureStore([]);

describe("Surveys Delete Button", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const store = mockStore({
      user: {
        userInfo: {
          email: "test@mail.com",
          fullName: "Test User",
          adminLevel: "super_admin",
          firebaseUid: "RaNdOmStRiNg",
          administeredReefs: [],
          token: "RaNdOmStRiNg",
        },
      },
    });

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <DeleteButton reefId={0} surveyId={0} diveDate="10/2/2020" />
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
