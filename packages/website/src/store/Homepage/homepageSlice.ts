import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { HomePageState } from "./types";
import { Reef } from "../Reefs/types";
import type { RootState } from "../configure";

const homepageInitialState: HomePageState = {
  reefOnMap: null,
};

const homepageSlice = createSlice({
  name: "homepage",
  initialState: homepageInitialState,
  reducers: {
    setReefOnMap: (state, action: PayloadAction<Reef>) => ({
      ...state,
      reefOnMap: action.payload,
    }),
    unsetReefOnMap: () => ({
      reefOnMap: null,
    }),
  },
});

export const reefOnMapSelector = (
  state: RootState
): HomePageState["reefOnMap"] => state.homepage.reefOnMap;

export const { setReefOnMap, unsetReefOnMap } = homepageSlice.actions;

export default homepageSlice.reducer;
