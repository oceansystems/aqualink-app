import React from "react";
import { render } from "@testing-library/react";
import Dialog from ".";

test("renders as expected", () => {
  const { container } = render(
    <Dialog
      open
      onClose={() => {}}
      header="Random Header"
      content={<div>Some random content</div>}
      actions={[]}
    />
  );
  expect(container).toMatchSnapshot();
});
