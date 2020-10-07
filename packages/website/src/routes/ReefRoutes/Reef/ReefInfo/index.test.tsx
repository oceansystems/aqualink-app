import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ReefNavBar from ".";

test("renders as expected", () => {
  const { container } = render(
    <Router>
      <ReefNavBar
        reefName=""
        managerName=""
        lastSurvey="May 10, 2020"
        lastDailyDataDate="May 10, 2020"
      />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
