import { sortBy } from "lodash";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import reefServices from "../../services/reefServices";
import { hasDeployedSpotter } from "../../helpers/reefUtils";
import type { ReefsListState, ReefsRequestData } from "./types";
import type { CreateAsyncThunkTypes, RootState } from "../configure";
import { mapCollectionData } from "./helpers";

const reefsListInitialState: ReefsListState = {
  loading: false,
  error: null,
};

export const reefsRequest = createAsyncThunk<
  ReefsRequestData,
  undefined,
  CreateAsyncThunkTypes
>("reefsList/request", async (arg, { rejectWithValue, getState }) => {
  try {
    const { data } = await reefServices.getReefs();
    const {
      homepage: { withSpotterOnly },
    } = getState();
    const sortedData = sortBy(data, "name");
    const transformedData = sortedData.map((item) => ({
      ...item,
      collectionData: mapCollectionData(item.collectionData || {}),
    }));
    return {
      list: transformedData,
      reefsToDisplay: withSpotterOnly
        ? transformedData.filter(hasDeployedSpotter)
        : transformedData,
    };
  } catch (err) {
    const error: AxiosError<ReefsListState["error"]> = err;
    return rejectWithValue(error.message);
  }
});

const reefsListSlice = createSlice({
  name: "reefsList",
  initialState: reefsListInitialState,
  reducers: {
    filterReefsWithSpotter: (state, action: PayloadAction<boolean>) => ({
      ...state,
      reefsToDisplay: action.payload
        ? state.list?.filter(hasDeployedSpotter)
        : state.list,
    }),
    setReefs: (state, action: PayloadAction<ReefsListState["list"]>) => ({
      ...state,
      list: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(
      reefsRequest.fulfilled,
      (state, action: PayloadAction<ReefsRequestData>) => {
        return {
          ...state,
          list: action.payload.list,
          reefsToDisplay: action.payload.reefsToDisplay,
          loading: false,
        };
      }
    );

    builder.addCase(reefsRequest.rejected, (state, action) => {
      return {
        ...state,
        error: action.error.message
          ? action.error.message
          : action.error.toString(),
        loading: false,
      };
    });

    builder.addCase(reefsRequest.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });
  },
});

export const reefsListSelector = (state: RootState): ReefsListState["list"] =>
  state.reefsList.list;

export const reefsToDisplayListSelector = (
  state: RootState
): ReefsListState["reefsToDisplay"] => state.reefsList.reefsToDisplay;

export const reefsListLoadingSelector = (
  state: RootState
): ReefsListState["loading"] => state.reefsList.loading;

export const reefsListErrorSelector = (
  state: RootState
): ReefsListState["error"] => state.reefsList.error;

export const { filterReefsWithSpotter, setReefs } = reefsListSlice.actions;

export default reefsListSlice.reducer;
