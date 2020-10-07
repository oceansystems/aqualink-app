import React from "react";
import { render } from "@testing-library/react";
import LocationMap from ".";

test("renders as expected", () => {
  const { container } = render(
    <LocationMap markerPosition={[1, 1]} setMarkerPosition={() => {}} />
  );
  expect(container).toMatchSnapshot();
});
