import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Popup from ".";
import { Reef } from "../../../../store/Reefs/types";

test("renders as expected", () => {
  const reef: Reef = {
    id: 0,
    name: "",
    polygon: {
      coordinates: [0, 0],
      type: "Point",
    },
    temperatureThreshold: 0,
    depth: 0,
    status: 0,
    videoStream: null,
    region: "",
    admin: null,
    stream: null,
    dailyData: [],
  };

  const { container } = render(
    <Router>
      <Popup reef={reef} />
    </Router>
  );
  expect(container).toMatchSnapshot();
});
