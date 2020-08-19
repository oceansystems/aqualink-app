import React from "react";
import { render } from "@testing-library/react";

import FeatureVideo from ".";

test("renders as expected", () => {
  const { container } = render(<FeatureVideo url={null} />);
  expect(container).toMatchSnapshot();
});
