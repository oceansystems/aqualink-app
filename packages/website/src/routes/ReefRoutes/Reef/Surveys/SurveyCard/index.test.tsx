import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";
import SurveyCard from ".";
import { SurveyListItem } from "../../../../../store/Survey/types";

const mockStore = configureStore([]);

describe("Surveys Delete Button", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const survey: SurveyListItem = {
      id: 0,
      diveLocation: null,
      diveDate: null,
      weatherConditions: "calm",
      comments: "",
      temperature: 24.5,
      observations: ["possible-disease"],
      userId: {
        id: 0,
        fullName: "Test User",
      },
    };

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
        <Router>
          <SurveyCard isAdmin reefId={0} survey={survey} />
        </Router>
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
