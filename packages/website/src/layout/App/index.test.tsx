import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

jest.mock("../../routes/Homepage", () => "Mock-Homepage");
jest.mock("../../routes/ReefRoutes", () => "Mock-ReefRoutes");
jest.mock("../../routes/About", () => "Mock-About");
jest.mock("../../routes/Apply", () => "Mock-Apply");
jest.mock("../../routes/Buoy", () => "Mock-Buoy");
jest.mock("../../routes/Drones", () => "Mock-Drones");
jest.mock("../../routes/Faq", () => "Mock-Faq");
jest.mock("../../routes/NotFound", () => ({
  __esModule: true,
  NotFound: "Mock-NotFound",
}));

test("renders as expected", () => {
  const { container } = render(
    <Router>
      <Switch>
        <Route exact path="/" component={() => <div>Homepage</div>} />
        <Route path="/reefs" component={() => <div>Reefs</div>} />
        <Route default component={() => <div>Not Found</div>} />
      </Switch>
    </Router>
  );
  expect(container).toMatchSnapshot();
});
