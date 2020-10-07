import React from "react";
import { render } from "@testing-library/react";

import FeaturedMedia from ".";

test("renders as expected", () => {
  const { container } = render(<FeaturedMedia url={null} />);
  expect(container).toMatchSnapshot();
});
