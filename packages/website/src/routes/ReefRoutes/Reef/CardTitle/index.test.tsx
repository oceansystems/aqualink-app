import React from "react";
import { render } from "@testing-library/react";
import CardTitle, { Value } from ".";

const values: Value[] = [
  {
    text: "Some value",
    variant: "h6",
    marginRight: "1rem",
  },
];

test("renders as expected", () => {
  const { container } = render(<CardTitle values={values} />);
  expect(container).toMatchSnapshot();
});
