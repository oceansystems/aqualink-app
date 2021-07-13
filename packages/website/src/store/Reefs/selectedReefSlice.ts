import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { sortBy } from "lodash";
import type { AxiosError } from "axios";
import type {
  OceanSenseData,
  OceanSenseDataRequestParams,
  Pois,
  ReefUpdateParams,
  SelectedReefState,
  TimeSeriesDataRangeRequestParams,
  TimeSeriesDataRequestParams,
} from "./types";
import type { RootState, CreateAsyncThunkTypes } from "../configure";
import reefServices from "../../services/reefServices";
import {
  mapOceanSenseData,
  mapTimeSeriesData,
  mapTimeSeriesDataRanges,
} from "./helpers";

const selectedReefInitialState: SelectedReefState = {
  draft: null,
  loading: true,
  timeSeriesDataLoading: false,
  timeSeriesDataRangeLoading: false,
  latestOceanSenseDataLoading: false,
  latestOceanSenseDataError: null,
  oceanSenseDataLoading: false,
  oceanSenseDataError: null,
  error: null,
};

export const reefRequest = createAsyncThunk<
  SelectedReefState["details"],
  string,
  CreateAsyncThunkTypes
>("selectedReef/request", async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await reefServices.getReef(id);
    const { data: dailyData } = await reefServices.getReefDailyData(id);
    const { data: liveData } = await reefServices.getReefLiveData(id);
    const { data: surveyPoints } = await reefServices.getReefPois(id);

    return {
      ...data,
      dailyData,
      liveData,
      historicalMonthlyMean: sortBy(
        data.historicalMonthlyMean,
        (item) => item.month
      ).map((item) => ({
        id: item.id,
        month: item.month,
        temperature: item.temperature,
      })),
      surveyPoints: surveyPoints.map((point) => ({
        id: point.id,
        name: point.name,
        polygon: point.polygon,
      })),
    };
  } catch (err) {
    const error: AxiosError<SelectedReefState["error"]> = err;
    return rejectWithValue(error.message);
  }
});

export const reefOceanSenseDataRequest = createAsyncThunk<
  { data: OceanSenseData; latest?: boolean },
  OceanSenseDataRequestParams & { latest?: boolean },
  CreateAsyncThunkTypes
>(
  "selectedReef/oceanSenseDataRequest",
  async ({ latest, ...params }, { rejectWithValue }) => {
    try {
      const { data } = await reefServices.getOceanSenseData(params);
      return { data: mapOceanSenseData(data), latest };
    } catch (err) {
      const error: AxiosError<SelectedReefState["error"]> = err;
      return rejectWithValue(error.message);
    }
  }
);

export const reefTimeSeriesDataRequest = createAsyncThunk<
  {
    granularDailyData: SelectedReefState["granularDailyData"];
    timeSeriesData: SelectedReefState["timeSeriesData"];
  },
  TimeSeriesDataRequestParams,
  CreateAsyncThunkTypes
>(
  "selectedReef/timeSeriesDataRequest",
  async (params: TimeSeriesDataRequestParams, { rejectWithValue }) => {
    try {
      const {
        data: timeSeriesDataResponse,
      } = await reefServices.getReefTimeSeriesData(params);
      const { data: granularDailyData } = await reefServices.getReefDailyData(
        params.reefId,
        params.start,
        params.end
      );
      return {
        granularDailyData,
        timeSeriesData: mapTimeSeriesData(timeSeriesDataResponse),
      };
    } catch (err) {
      const error: AxiosError<SelectedReefState["error"]> = err;
      return rejectWithValue(error.message);
    }
  }
);

export const reefTimeSeriesDataRangeRequest = createAsyncThunk<
  SelectedReefState["timeSeriesDataRange"],
  TimeSeriesDataRangeRequestParams,
  CreateAsyncThunkTypes
>(
  "selectedReef/timeSeriesDataRangeRequest",
  async (params: TimeSeriesDataRangeRequestParams, { rejectWithValue }) => {
    try {
      const { data } = await reefServices.getReefTimeSeriesDataRange(params);
      return mapTimeSeriesDataRanges(data);
    } catch (err) {
      const error: AxiosError<SelectedReefState["error"]> = err;
      return rejectWithValue(error.message);
    }
  }
);

const selectedReefSlice = createSlice({
  name: "selectedReef",
  initialState: selectedReefInitialState,
  reducers: {
    setReefDraft: (
      state,
      action: PayloadAction<SelectedReefState["draft"]>
    ) => ({
      ...state,
      draft: action.payload,
    }),
    setSelectedReef: (
      state,
      action: PayloadAction<SelectedReefState["details"]>
    ) => ({
      ...state,
      details: action.payload,
    }),
    setReefData: (state, action: PayloadAction<ReefUpdateParams>) => {
      if (state.details) {
        return {
          ...state,
          details: {
            ...state.details,
            name: action.payload.name || state.details.name,
            depth: action.payload.depth || state.details.depth,
            polygon:
              state.details.polygon.type === "Point"
                ? {
                    ...state.details.polygon,
                    coordinates: [
                      action.payload.coordinates?.longitude ||
                        state.details.polygon.coordinates[0],
                      action.payload.coordinates?.latitude ||
                        state.details.polygon.coordinates[1],
                    ],
                  }
                : { ...state.details.polygon },
          },
        };
      }
      return state;
    },
    setReefPois: (state, action: PayloadAction<Pois[]>) => {
      if (state.details) {
        return {
          ...state,
          details: {
            ...state.details,
            surveyPoints: action.payload,
          },
        };
      }
      return state;
    },
    clearTimeSeriesData: (state) => ({ ...state, timeSeriesData: undefined }),
    clearTimeSeriesDataRange: (state) => ({
      ...state,
      timeSeriesDataRange: undefined,
    }),
    clearGranularDailyData: (state) => ({
      ...state,
      granularDailyData: undefined,
    }),
    clearOceanSenseData: (state) => ({
      ...state,
      oceanSenseData: undefined,
      latestOceanSenseData: undefined,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(
      reefRequest.fulfilled,
      (state, action: PayloadAction<SelectedReefState["details"]>) => {
        return {
          ...state,
          details: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(
      reefRequest.rejected,
      (state, action: PayloadAction<SelectedReefState["error"]>) => {
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
        error: null,
      };
    });

    builder.addCase(
      reefOceanSenseDataRequest.fulfilled,
      (
        state,
        action: PayloadAction<{ data: OceanSenseData; latest?: boolean }>
      ) => ({
        ...state,
        latestOceanSenseData: action.payload.latest
          ? action.payload.data
          : state.latestOceanSenseData,
        latestOceanSenseDataLoading: action.payload.latest
          ? false
          : state.latestOceanSenseDataLoading,
        oceanSenseData: !action.payload.latest
          ? action.payload.data
          : state.oceanSenseData,
        oceanSenseDataLoading: !action.payload.latest
          ? false
          : state.oceanSenseDataLoading,
      })
    );

    builder.addCase(reefOceanSenseDataRequest.rejected, (state, action) => {
      return {
        ...state,
        latestOceanSenseDataError: action.meta.arg.latest
          ? action.error.message
          : state.latestOceanSenseDataError,
        latestOceanSenseDataLoading: action.meta.arg.latest
          ? false
          : state.latestOceanSenseDataLoading,
        oceanSenseDataError: !action.meta.arg.latest
          ? action.error.message
          : state.oceanSenseDataError,
        oceanSenseDataLoading: !action.meta.arg.latest
          ? false
          : state.oceanSenseDataLoading,
      };
    });

    builder.addCase(reefOceanSenseDataRequest.pending, (state, action) => {
      return {
        ...state,
        latestOceanSenseDataLoading: action.meta.arg.latest
          ? true
          : state.latestOceanSenseDataLoading,
        latestOceanSenseDataError: action.meta.arg.latest
          ? null
          : state.latestOceanSenseDataError,
        oceanSenseDataLoading: !action.meta.arg.latest
          ? true
          : state.oceanSenseDataLoading,
        oceanSenseDataError: !action.meta.arg.latest
          ? null
          : state.oceanSenseDataError,
      };
    });

    builder.addCase(
      reefTimeSeriesDataRequest.fulfilled,
      (
        state,
        action: PayloadAction<{
          granularDailyData: SelectedReefState["granularDailyData"];
          timeSeriesData: SelectedReefState["timeSeriesData"];
        }>
      ) => ({
        ...state,
        granularDailyData: action.payload.granularDailyData,
        timeSeriesData: action.payload.timeSeriesData,
        timeSeriesDataLoading: false,
      })
    );

    builder.addCase(
      reefTimeSeriesDataRequest.rejected,
      (state, action: PayloadAction<SelectedReefState["error"]>) => ({
        ...state,
        error: action.payload,
        timeSeriesDataLoading: false,
      })
    );

    builder.addCase(reefTimeSeriesDataRequest.pending, (state) => {
      return {
        ...state,
        timeSeriesDataLoading: true,
        error: null,
      };
    });

    builder.addCase(
      reefTimeSeriesDataRangeRequest.fulfilled,
      (
        state,
        action: PayloadAction<SelectedReefState["timeSeriesDataRange"]>
      ) => ({
        ...state,
        timeSeriesDataRange: action.payload,
        timeSeriesDataRangeLoading: false,
      })
    );

    builder.addCase(
      reefTimeSeriesDataRangeRequest.rejected,
      (state, action: PayloadAction<SelectedReefState["error"]>) => ({
        ...state,
        error: action.payload,
        timeSeriesDataRangeLoading: false,
      })
    );

    builder.addCase(reefTimeSeriesDataRangeRequest.pending, (state) => {
      return {
        ...state,
        timeSeriesDataRangeLoading: true,
        error: null,
      };
    });
  },
});

export const reefDetailsSelector = (
  state: RootState
): SelectedReefState["details"] => state.selectedReef.details;

export const reefGranularDailyDataSelector = (
  state: RootState
): SelectedReefState["granularDailyData"] =>
  state.selectedReef.granularDailyData;

export const reefTimeSeriesDataSelector = (
  state: RootState
): SelectedReefState["timeSeriesData"] => state.selectedReef.timeSeriesData;

export const reefTimeSeriesDataLoadingSelector = (
  state: RootState
): SelectedReefState["timeSeriesDataLoading"] =>
  state.selectedReef.timeSeriesDataLoading;

export const reefTimeSeriesDataRangeSelector = (
  state: RootState
): SelectedReefState["timeSeriesDataRange"] =>
  state.selectedReef.timeSeriesDataRange;

export const reefTimeSeriesDataRangeLoadingSelector = (
  state: RootState
): SelectedReefState["timeSeriesDataRangeLoading"] =>
  state.selectedReef.timeSeriesDataRangeLoading;

export const reefDraftSelector = (
  state: RootState
): SelectedReefState["draft"] => state.selectedReef.draft;

export const reefLoadingSelector = (
  state: RootState
): SelectedReefState["loading"] => state.selectedReef.loading;

export const reefErrorSelector = (
  state: RootState
): SelectedReefState["error"] => state.selectedReef.error;

export const reefLatestOceanSenseDataSelector = (
  state: RootState
): SelectedReefState["latestOceanSenseData"] =>
  state.selectedReef.latestOceanSenseData;

export const reefLatestOceanSenseDataLoadingSelector = (
  state: RootState
): SelectedReefState["latestOceanSenseDataLoading"] =>
  state.selectedReef.latestOceanSenseDataLoading;

export const reefLatestOceanSenseDataErrorSelector = (
  state: RootState
): SelectedReefState["latestOceanSenseDataError"] =>
  state.selectedReef.latestOceanSenseDataError;

export const reefOceanSenseDataSelector = (
  state: RootState
): SelectedReefState["oceanSenseData"] => state.selectedReef.oceanSenseData;

export const reefOceanSenseDataLoadingSelector = (
  state: RootState
): SelectedReefState["oceanSenseDataLoading"] =>
  state.selectedReef.oceanSenseDataLoading;

export const reefOceanSenseDataErrorSelector = (
  state: RootState
): SelectedReefState["oceanSenseDataError"] =>
  state.selectedReef.oceanSenseDataError;

export const {
  setReefDraft,
  setSelectedReef,
  setReefData,
  clearTimeSeriesData,
  clearTimeSeriesDataRange,
  clearGranularDailyData,
  clearOceanSenseData,
  setReefPois,
} = selectedReefSlice.actions;

export default selectedReefSlice.reducer;
