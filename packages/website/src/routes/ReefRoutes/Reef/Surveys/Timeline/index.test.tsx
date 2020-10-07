import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";

import Timeline from ".";

const mockStore = configureStore([]);

describe("ReefRoutes Surveys", () => {
  let element: HTMLElement;
  beforeEach(() => {
    const store = mockStore({
      surveyList: {
        list: [
          {
            comments: "No comments",
            diveDate: "2020-09-10T10:27:00.000Z",
            id: 46,
            temperature: null,
            weatherConditions: "calm",
            userId: {
              id: 0,
              name: "Joe Doe",
            },
            featuredSurveyMedia: {
              comments: null,
              featured: true,
              hidden: false,
              id: 66,
              metadata: "{}",
              observations: "possible-disease",
              quality: 1,
              type: "image",
              url: "",
            },
          },
        ],
        loading: false,
        error: null,
      },
    });

    store.dispatch = jest.fn();

    element = render(
      <Provider store={store}>
        <Router>
          <Timeline isAdmin={false} reefId={0} observation="any" point={0} />
        </Router>
      </Provider>
    ).container;
  });

  it("should render with given state from Redux store", () => {
    expect(element).toMatchSnapshot();
  });
});
