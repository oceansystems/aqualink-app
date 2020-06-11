import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { ReefState } from "./types";
import { RootState, CreateAsyncThunkTypes } from "../configure";
import reefServices from "../../services/reefServices";

const selectedReefInitialState: ReefState = {
  details: {
    id: "",
    region_name: "",
    manager_name: "",
  },
  loading: false,
  error: "",
};

export const reefRequest = createAsyncThunk<
  ReefState["details"],
  string,
  CreateAsyncThunkTypes
>("selectedReef/request", async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await reefServices.getReef(id);
    return data;
  } catch (err) {
    const error: AxiosError<ReefState["error"]> = err;
    return rejectWithValue(error.message);
  }
});

const selectedReefSlice = createSlice({
  name: "selectedReef",
  initialState: selectedReefInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      reefRequest.fulfilled,
      (state, action: PayloadAction<ReefState["details"]>) => {
        return {
          ...state,
          details: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(
      reefRequest.rejected,
      (state, action: PayloadAction<ReefState["error"]>) => {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(reefRequest.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
  },
});

export const reefDetailsSelector = (state: RootState): ReefState["details"] => {
  return state.selectedReef.details;
};

export const reefLoadingSelector = (state: RootState): ReefState["loading"] => {
  return state.selectedReef.loading;
};

export const reefErrorSelector = (state: RootState): ReefState["error"] => {
  return state.selectedReef.error;
};

export default selectedReefSlice.reducer;
