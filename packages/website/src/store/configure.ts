import { configureStore } from "@reduxjs/toolkit";

/* eslint-disable-next-line import/no-cycle */
import reducer from "./reducer";

export const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type CreateAsyncThunkTypes = {
  dispatch: AppDispatch;
  state: RootState;
  rejectValue: string;
};
