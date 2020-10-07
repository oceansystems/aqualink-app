import { sortBy } from "lodash";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { SurveyListState } from "./types";

import type { RootState, CreateAsyncThunkTypes } from "../configure";
import surveyServices from "../../services/surveyServices";

const surveyListInitialState: SurveyListState = {
  list: [],
  loading: false,
  error: null,
};

const getSurveys = async (reefId: string) => {
  try {
    const { data } = await surveyServices.getSurveys(reefId);
    return sortBy(data, "diveDate");
  } catch (err) {
    const error: AxiosError<SurveyListState["error"]> = err;
    return Promise.reject(error.message);
  }
};

export const surveysRequest = createAsyncThunk<
  SurveyListState["list"],
  string,
  CreateAsyncThunkTypes
>("surveysList/request", (reefId: string) => getSurveys(reefId));

const surveyListSlice = createSlice({
  name: "surveyList",
  initialState: surveyListInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      surveysRequest.fulfilled,
      (state, action: PayloadAction<SurveyListState["list"]>) => {
        return {
          ...state,
          list: action.payload.filter((survey) => survey.featuredSurveyMedia),
          loading: false,
        };
      }
    );

    builder.addCase(surveysRequest.rejected, (state, action) => {
      return {
        ...state,
        error: action.error.message
          ? action.error.message
          : action.error.toString(),
        loading: false,
      };
    });

    builder.addCase(surveysRequest.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });
  },
});

export const surveyListSelector = (state: RootState): SurveyListState["list"] =>
  state.surveyList.list;

export const surveyListLoadingSelector = (
  state: RootState
): SurveyListState["loading"] => state.surveyList.loading;

export const surveyListErrorSelector = (
  state: RootState
): SurveyListState["error"] => state.surveyList.error;

export default surveyListSlice.reducer;
